+++
title = "[WIP] On the Privacy of Apple Location Services"
+++

> [Skip technical stuff](#user-relevant-info)

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

## Data Collection and Analysis

To analyze Apple's location service traffic, I intercepted HTTPS requests from an iPhone running IOS 18.6.2 over the course of 7 days using `mitmproxy`'s WireGuard mode. The device was used as a normal daily driver (apps opened, routes walked, payments made). Flows were captured and exported into a .flow file and analyzed offline. Below are conclusions drawn from an analysis of the decoded data based on the aforementioned reverse engineering.

---

## <span id="user-relevant-info">Privacy Settings, Policy, and Reality</span>

[Less than 5% of users change their default settings](https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/), and even fewer read through privacy policies. To make matters worse, software updates occasionally reset or alter these settings “by mistake,” which often goes unnoticed.

These defaults therefore play an outsized role in determining how much Apple learns about you.

Long story short: under **Privacy & Security > Location Services > System Services**, it’s worth turning off at least the following options:

- **Routing & Traffic**
- **Apple Pay Merchant Identification**
- **Improve Maps**
- **iPhone Analytics**

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

### Apple Pay Merchant Information

> _Apple Pay Merchant Identification: Your iPhone will use your current location to help provide more accurate merchant names when you use your physical Apple Card._

Collected data includes:

- Card provider
- Currency
- Transaction ID
- Merchant name
- Timestamp

Example (from `https://gsp-ssl.ls.apple.com/dispatcher.arpc`):

```json
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

Surprisingly, disabling the toggle only stops **uploading** the data—not **collection**. Data is stored locally until you re-enable the setting, at which point it’s uploaded. In one case, a timestamp (4739811754110877696 → Aug 30, 2025) predated the moment I enabled the setting by about a week. In other words, temporary privacy is impossible.

### Improve Maps & iPhone Analytics

> _If you enable Improve Maps, Apple will collect GPS coordinates obtained via Significant Locations and correlate them with your Apple Account … Your device will also periodically send data about where and when you launch apps … in an anonymous and encrypted form …_

Endpoint: `https://gsp64-ssl.ls.apple.com/hvr/v3/use`

This endpoint doesn’t use protobuf, so decoding is limited to string analysis. Observed payloads include:

- Subsets of open apps (network tools like WireGuard, Mullvad, Little Snitch are common)
- Addresses linked to the Apple account (e.g. from Contacts)
- IPs and ports the device is connected to
- BSSIDs

With settings disabled, requests are still sent—but reduced to just home location and timestamps.

### <span id="endpoint-summary">Endpoint summary</span>

| Domain                   | Path(s)            | Controlled by Setting                 | Data Sent                                                                                         | Notes                                                                  |
| ------------------------ | ------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `gsp10-ssl.apple.com`    | `/pds/pd`, `/au`   | **Routing & Traffic**                 | GPS coordinates, travel speed, barometric pressure, app launches near POIs                        | Sent continuously; “anonymous” but easily linkable via app/device data |
| `gsp-ssl.ls.apple.com`   | `/dispatcher.arpc` | **Apple Pay Merchant Identification** | Card provider, currency, transaction ID, merchant name, timestamp                                 | Data still collected locally when disabled; uploaded once re-enabled   |
| `gsp64-ssl.ls.apple.com` | `/hvr/v3/use`      | **Improve Maps & iPhone Analytics**   | Open apps (esp. network tools), Apple account–linked addresses, IPs and ports, BSSIDs, timestamps | Requests persist even when disabled, but with reduced detail           |
| `gsp10-ssl.apple.com`    | `/hcy/pbcwloc`     | Always on (not user-controlled)       | Nearby BSSIDs, cell provider, location, movement/activity                                         | Passive Wi-Fi/cell scanning; builds Apple’s positioning database       |

---

## Privacy TODO

- App uniqueness: Poll on app-install combinations to demonstrate how uniquely idenntifying they are within a given population or IP range.
- Cross service correlation: Other Apple system services, possibly authenticated, are sent from the same IP address and may contain information that could be matched to the "anonymous" data.
- Simulate devices based on captured data and do a practical in correlating traffic
- Perspective of a network adversary: How much can an ISP glean from use the traffic patterns and sizes. Train a ML model.

---

## Update patterns of Apple's location database

Over the course of a week, I recorded **436,771 location changes** and **10,301 unique BSSIDs** across 10 evenly distributed groups of 5 tile keys.

- **Average distance change:** 0.69 m
- **Minimum distance:** 0.01 m
- **Maximum distance:** 24.87 m
- **Standard deviation:** 1.01 m

<img alt="Average distance moved over time" src="https://r2.duti.dev/blog/images/distance_changes_plot.png" style="max-height:30rem;" />

At first glance, the average distance and tight standard deviation seem artificial. Digging deeper, the update behavior looks even stranger:

<img alt="Distribution of time between updates" src="https://r2.duti.dev/blog/images/unique_locations_analysis.png" style="max-height:20rem;"/>

Most changes involved oscillating between just a handful of unique coordinates (typically 1–6 based on the number of days of recorded data), even though some access points showed up to 93 separate “update” events. This strongly suggests that only **one genuine update occurs per day**, with locations oscillating during the update window rather than reflecting real movement.

<img alt="Distribution of time between updates" src="https://r2.duti.dev/blog/images/update_intervals_analysis.png" style="max-height:20rem;"/>

Every day, there is a consistent **5-hour update window**—from **05:00 to 09:00 UTC**—during which database entries are refreshed. Each access point is guaranteed at least one update every 24 hours, though many are updated multiple times within the window. This clustering explains the bursts of short intervals seen in the update graphs.

Importantly, the update windows are not isolated to specific tiles. Instead, updates occur across large numbers of tiles simultaneously, implying that Apple maintains a **centralized database** rather than distributed, region-specific updates.

**Open questions:**

- The oscillation pattern produces a distinctive distribution shape in the data. This could be intentional, perhaps as a **privacy mechanism** to obscure whether updates are tied to human presence.
- The artificial feel of the distances suggests further smoothing or obfuscation may be applied server-side.
