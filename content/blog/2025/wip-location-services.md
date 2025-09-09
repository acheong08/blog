+++
title = "[WIP] On the Privacy of Apple Location Services"
+++

> [Skip the fluff](#endpoint-table)

## Background

Contrary to popular belief, GPS is no longer the primary method mobile devices use to determine location.

Instead, companies like Google and Apple maintain massive databases of Wi-Fi hotspots and cell towers. Phones collect signals from these beacons—including strength and identifiers—and use them to triangulate their position, with the help of data provided by these vendors.

![Trilateration algorithm for n points](https://r2.duti.dev/blog/images/trilateration.png)

To build these databases, iOS and Android devices act as passive wardrivers: they continuously report nearby access points to Apple and Google. This data is then aggregated across countless devices to determine the locations of access points with high accuracy.

A recent paper, ["Surveilling the Masses with Wi-Fi-Based Positioning Systems"](https://www.cs.umd.edu/~dml/papers/wifi-surveillance-sp24.pdf) (May 2024), explores how Apple’s location services can be weaponized to track movements worldwide—particularly in sensitive contexts like war zones and natural disasters.

I found the paper fascinating. On the same day it was published, I began reverse engineering the `clls/wloc` endpoint using definitions decompiled from `CoreLocationProtobuf.framework`. Over the following weeks, I uncovered additional endpoints, such as:

- `wifi_request_tile`: retrieves BSSIDs in a given area via an obfuscated tile key
- `hcy/pbcwloc`: uploads data about newly discovered endpoints

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

---

## Working Out the Protobuf

The payload itself can contain any arbitrary bytes—including encrypted blobs—but in most observed cases it uses **protobuf**. The next challenge is discovering the protobuf definitions.

Tools like [protodump](https://github.com/arkadiyt/protodump) can extract protobuf file descriptors from raw binaries, but they don’t work with Apple’s custom compiler, which converts protobuf definitions directly to Objective-C.

Most of the protobuf decoding logic isn’t located in the `locationd`, `geod`, or `geoanalyticsd` binaries themselves. Instead, it resides in private frameworks inside the dyld cache. To extract them, use [dyld-shared-cache-extractor](https://github.com/keith/dyld-shared-cache-extractor). To fetch the filesystem image for iOS, use [ipsw](https://github.com/blacktop/ipsw):

```sh
ipsw download ipsw --version 18.6.2 --device iPhone15,2
ipsw extract --files --pattern ".*" iPhone15,2_18.6.2_22G100_Restore.ipsw
```

On macOS, the iOS Simulator runs its system binaries natively, which allows attaching `lldb`—but only with SIP (System Integrity Protection) disabled.

```sh
ps aux | grep simruntime | grep locationd   # Find the PID of locationd running within the simulator
sudo lldb -p <pid>                          # Attach to process (requires SIP disabled)
br set -n "-[NSURLSessionTask resume]"      # Set breakpoint on network requests
po [$x0 originalRequest]                    # Inspect request details (e.g. URL)
```

The next step is mapping addresses in **Ghidra**.

To find the base load address, run:

```
image list <binary name, e.g. geoanalyticsd>
```

Then, from the backtrace, take the top frame address that matches your binary. Subtract the base load address to get a file offset, then add `0x100000000` to obtain the virtual address expected by Ghidra.

Example:

```
p/x 0x1048ddda0 - 0x1048d4000 = 0x9da0
p/x 0x100000000 + 0x9da0      = 0x100009da0
```

Finally, in Ghidra:
`Navigation > Go To` → paste the calculated address.

<img alt="Screenshot of decompiled C for wloc protobuf" src="https://r2.duti.dev/blog/images/reversed-wloc-protoc.png" style="max-height: 40rem;"/>

Using the index numbers and associated symbols, the protobuf definition can then be manually reconstructed.

---

## Privacy Settings, Policy, and Reality

[Less than 5% of users change their default settings](https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/), and even fewer read through privacy policies. To make matters worse, software updates occasionally reset or alter these settings “by mistake,” which often goes unnoticed.

These defaults therefore play an outsized role in determining how much Apple learns about you.

Long story short: under **Privacy & Security > Location Services > System Services**, it’s worth turning off at least the following options:

- **Routing & Traffic**
- **Apple Pay Merchant Identification**
- **Improve Maps**
- **iPhone Analytics**

---

### Routing & Traffic

> _While you are in transit (for example, walking or driving), your iPhone will periodically send GPS data, travel speed and direction, and barometric pressure information in an anonymous and encrypted form to Apple, to be used for augmenting crowd-sourced road traffic, roadway, pedestrian walkway, and atmospheric correction databases. Additionally, when you open an app near a point of interest (for example, a business or park) your iPhone will send location data in an anonymous and encrypted form to Apple which Apple may aggregate and use to let users know if that point of interest is open and how busy it is._
>
> — [Apple Privacy Policy](https://www.apple.com/legal/privacy/data/en/location-services/)

On paper, this sounds innocuous. In practice, Apple’s definitions of **“transit”** and **“point of interest”** (POI) are so broad that nearly all activity qualifies:

- “Transit” applies whenever your phone is moving—whether on foot, in a car, or even on a bicycle.
- “Point of interest” applies whenever you stop somewhere—whether it’s a shop, a bus stop, or a friend’s house.

Effectively, this means your iPhone is sending data to Apple whether you are moving or stationary—essentially _all the time_.

You might also expect the data to be sent in small, randomized chunks that are harder to link together. Instead, requests are grouped into larger batches, which makes correlation much easier.

Here’s what this looks like in practice:

1. `https://gsp10-ssl.apple.com/pds/pd` — routing data
2. `https://gsp10-ssl.apple.com/au` — app usage near POIs

<img src="https://r2.duti.dev/blog/images/pds-transit-map.png" width="400" alt="Map of me walking home after an event"> <img src="https://r2.duti.dev/blog/images/au-app-map.png" width="500" alt="Map of open app locations">

Note: the above visualizations show just a _single_ request. In reality, data is aggregated and transmitted in larger bundles. When combined with:

- **timing information** (even though the requests are batched, the exact time is recorded for events and points),
- **device fingerprints** (locale, OS version, locationd/CFNetwork/Darwin version, etc.), and
- **installed app sets**,

...it becomes trivial to correlate requests from the same device. In fact, the installed app list often acts as a near-unique fingerprint, making it easy to tie activity back to a specific Apple account. Who else has the specific combination of HACK (HN Reader), Organic Maps, Discord, VLC, WireGuard, Maybank Malaysia, and Royal Mail, especially when further filtered by IP address and location.

Oh and the "encryption"? That's just TLS. This traffic is not more or less secure than the average website. This also means that ISPs and adjacent network advesaries are able to sniff the SNI to determine the activity of your phone and thus possible behaviors.

**TODO**

- App uniqueness: Poll on app-install combinations to demonstrate how uniquely idenntifying they are within a given population or IP range.
- Cross service correlation: Other Apple system services, possibly authenticated, are sent from the same IP address and may contain information that could be matched to the "anonymous" data.

### Apple Pay Merchant Information

> _Apple Pay Merchant Identification: Your iPhone will use your current location to help provide more accurate merchant names when you use your physical Apple Card._

This is pretty straightforward. The collected information is the card provider, currency, transaction ID, merchant name, and timestamp ([Cocoa](https://www.epochconverter.com/coredata))

From `https://gsp-ssl.ls.apple.com/dispatcher.arpc`

```json
...
    "6": {
      "1": "MasterCard",
      "11": "EUR",
      "16": 1,
      "17": "8D0DDB68-0C2D-4A39-AD20-77454B02D876",
      "18": 0,
      "2": "2TL BRUSSEL - NOORD",
      "21": "",
      "3": 4739811754110877696,
      "8": 0,
      "9": 1
    }
```

What is surprising, is that the toggle only controls whether the data is sent, not whether it's collected. The data is then stored locally until the setting is enabled before being sent. For example, 4739811754110877696 decodes to 778263300 (August 30, 2025 4:15:00 PM), which is approximately a week before I enabled the privacy settings. Temporary privacy is thus made impossible.

### Improve Maps and iPhone Analytics

> _If you choose to enable Improve Maps, Apple will collect the GPS coordinates obtained through the Significant Locations feature on your device and correlate them with the street address associated with your Apple Account. This will enable Apple to better approximate the geographic location of that and other addresses. Apple will retain the resulting coordinates only in an anonymous form to improve Maps and other Apple location-based products and services. Your iOS, iPadOS, or visionOS device will also periodically send locations of where and when you launched apps, including the name of the apps, in an anonymous and encrypted form to Apple in order to improve Maps and other Apple location-based products and services._

Endpoint: `https://gsp64-ssl.ls.apple.com/hvr/v3/use`
The payload is also not protobuf, only allowing us to deduce its contents through strings. A wide variety of data is sent to Apple through these endpoints, including:

- Some open apps, but not all. Most commonly observed are network related apps (e.g. Wireguard, Mullvad, Little Snitch)
- Locations associated with the Apple account (from Contacts app)
- A selection of IP addresses and ports the user is connected to
- BSSIDs

Overall, it's an odd mishmash of data and binary blobs. With settings disabled, requests are still sent, though smaller and lacking detail, including only home location and timestamps.
