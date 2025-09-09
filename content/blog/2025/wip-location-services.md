+++
title = "[WIP] On the Privacy of Apple Location Services"
+++

> [Skip the fluff](#endpoint-table)

## Background

Contrary to popular belief, GPS is no longer the primary method mobile devices use to determine location.

Instead, companies like Google and Apple maintain massive databases of Wi-Fi hotspots and cell towers. Phones collect signals from these beacons - including strength and identifiers - and use them to triangulate their position, with the help of data provided by these vendors.

![Trilateration algorithm for n points](https://r2.duti.dev/blog/images/trilateration.png)

To build these databases, iOS and Android devices act as passive wardrivers: they continuously report nearby access points to Apple and Google. This data is then aggregated across countless devices to determine the locations of access points with high accuracy.

A recent paper, ["Surveilling the Masses with Wi-Fi-Based Positioning Systems"](https://www.cs.umd.edu/~dml/papers/wifi-surveillance-sp24.pdf) (May 2024), explores how Apple’s location services can be weaponized to track movements worldwide - particularly in sensitive contexts like war zones and natural disasters.

I found the paper fascinating. On the same day it was published, I began reverse engineering the `clls/wloc` endpoint using definitions decompiled from `CoreLocationProtobuf.framework`. Over the following weeks, I uncovered additional endpoints, such as:

- `wifi_request_tile`: allows retrieval of BSSIDs in a given area via an obfuscated tile key
- `hcy/pbcwloc`: used for uploading data about newly discovered endpoints

By combining the `tile` endpoint with an expanding search algorithm layered on top of `wloc`, I was able to reproduce the dataset described in the paper within a single day.

With the external dataset re-created, the next question was: _how much data is actually being sent to Apple from devices in the first place?_  
I’m writing this from the University of Cambridge, where I’m spending three weeks on a research project exploring exactly that.

---

## Reverse Engineering the Protocols

Apple relies on a custom RPC format known as **ARPC**. Unlike typical self-describing formats, ARPC does not embed enough information to fully decode requests and responses on its own.

A standard **request** has the following structure:

| Field          | Size     | Type          | Description                   |
| -------------- | -------- | ------------- | ----------------------------- |
| Version        | 2 bytes  | uint16        | Protocol version              |
| Locale         | variable | pascal string | Locale string                 |
| AppIdentifier  | variable | pascal string | Application identifier string |
| OsVersion      | variable | pascal string | OS version string             |
| FunctionId     | 4 bytes  | uint32        | Function ID                   |
| Payload Length | 4 bytes  | uint32        | Length of payload             |
| Payload        | variable | bytes         | Payload data                  |

Responses are trickier: they can contain an arbitrary number of fields of unknown sizes. To parse them, one can exploit the fact that the **payload length** encodes the number of bytes from its position to the end of the message. Practically, this means scanning the response with a sliding 4-byte window, checking if each candidate encodes a valid remaining length. If multiple candidates match, the largest valid body size and corresponding header size are chosen.

## Working out the protobuf

The payload itself can contain any arbitrary bytes - including encrypted blobs - but in most observed cases it uses **protobuf**. The next trouble is thus how to find the protobuf definitions. While tools like [protodump](https://github.com/arkadiyt/protodump) exist to extract protobuf file descriptors from raw binary, this does not work on the custom compiler Apple for converting protobuf definition to Objective-C.

Most of the protobuf decoding is not done within the binary for locationd, geod, or geoanalyticsd itself, but rather in private frameworks from the dyld cache. Use [dyld-shared-cache-extractor](https://github.com/keith/dyld-shared-cache-extractor) to extract the framework binaries and [ipsw](https://github.com/blacktop/ipsw) to download the filesystem image for iOS.

```sh
ipsw download ipsw --version 18.6.2 --device iPhone15,2
ipsw extract --files --pattern ".*" iPhone15,2_18.6.2_22G100_Restore.ipsw
```

On macOS, the iOS Simulator runs its system binaries natively on the host, allowing us to attach lldb with SIP (System Integrity Protection) disabled.

`ps aux | grep simruntime | grep locationd` - Find the pid of locationd running within the simulator
`sudo lldb -p <pid>` - Attach to process. Remember to [disable SIP](https://ioshacker.com/how-to/disable-system-integrity-protection-sip-on-apple-silicon-m1-macs)
`br set -n "-[NSURLSessionTask resume]"` - Sets breakpoint on network requests
`po [$x0 originalRequest]` - View details of the request (e.g. URL)

The next step is to figure out the address in Ghidra.
To find the base load address, run `image list <binary name (e.g. geoanalyticsd)>`. Then, take the top frame address from the backtrace which matches your binary. `p/x <frame_runtime_address> - <base_load_address>` returns a file offset. Ghidra expects a virtual address, which can be calculated by adding `0x100000000`.
As an example, `p/x 0x1048ddda0 - 0x1048d4000` = `0x9da0`. `p/x 0x100000000 + 0x9da0` = `0x100009da0`.

Finally, in Ghidra, go to `Navigation > Go To`, and paste in that address.

![Screenshot of decompiled C for wloc protobuf](https://r2.duti.dev/blog/images/reversed-wloc-protoc.png)

Using the index numbers and associated symbols, we manually reconstruct the definition.
