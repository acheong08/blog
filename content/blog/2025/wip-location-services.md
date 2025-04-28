+++
title = "[WIP] On the privacy of Apple Location Services"
+++

Note: You can find most the code used in experimentation on GitHub: <https://github.com/acheong08/apple-corelocation-experiments/tree/main>

## Background

Contrary to common belief, GPS is no longer the primary mechanism by which mobile devices obtain their location.

Instead, companies such as Google and Apple maintain large location databases of Wi-Fi hotspots and cell towers. Phones collect the data of beacons and their signal strength which they use to triangulate their location using data from the vendors.

![Trilateration algorithm for n amount of points](https://r2.duti.dev/blog/images/trilateration.png)

Back in 2003, data for these databases were gathered through wardriving, and still is for semi-public datasets like WiGLE. However, for Apple and Google which holds control over almost the entirety of the mobile market, we have all become their wardrivers. Both IOS and Android periodically send up both your current location and a list of all nearby access points and their RSSI. By aggregating data from across devices, they use the same algorithm to triangulate the location of the access point.

There are two primary API endpoints used by IOS to find its location, `clls/wloc` and `wifi_request_tile`.

`clls/wloc` takes a list of BSSIDs, and returns up to 400 nearby BSSIDs with its coordinates. Using the signal strength of those access points, the triangulation is done on-device. Google has a similar endpoint following the ichnaea standard which instead requires the RSSI to be sent up and your location is triangulated by the service. This means that while Apple only knows your general location up to an accuracy of a few hundred meters, Google gets your location up to centimeters in accuracy.

A few hundred meters still isn't that great in terms of anonymity, which is likely one reason why Apple has the `wifi_request_tile`. With this endpoint Apple will send all the *specifically indoors* access point locations for a given area. This is because while outdoors, cell towers and traditional GPS can be used instead. During testing, I found that my phone cached the location data for the entire island of Penang, therefore making it such that location services worked indoors even without internet or GPS. As long as you stay within the area for which data has been cached, Apple cannot know your location.

Both endpoints use protobuf and the definitions can be found [here](https://github.com/acheong08/apple-corelocation-experiments/blob/main/pb/BSSIDApple.proto) and [here](https://github.com/acheong08/apple-corelocation-experiments/blob/main/pb/wifiTiles.proto). These were reverse engineered based on `_CLPWifiAPLocationReadFrom` from `CoreLocationProtobuf.framework` decompiled with Ghidra. For `wifi_request_tile`, a modified version of morton encoding is used. You can find the method [here](https://github.com/acheong08/apple-corelocation-experiments/blob/main/lib/morton/morton.go). It took me an infuriating amount of time to figure out - peak security through obscurity.

## Surveillance

["Surveilling the Masses with Wi-Fi-Based Positioning Systems"](https://www.cs.umd.edu/~dml/papers/wifi-surveillance-sp24.pdf) was published in May of 2024 and detailed a 1 year process of extracting 2 billion records out of the system. The primary method involved first using random BSSIDs to brute force and find records. Then, using the found records, the `clls/wloc` endpoint would be used to recursively find nearby access points.
<img alt="An illustration of recursively finding access points" src="https://r2.duti.dev/blog/images/wloc-recursive.svg" width="400">

This approach has a few flaws, primarily the amount of time needed and the fact that there are isolated pockets which randomness cannot reach (e.g. Antarctic research station).

Using the previously undiscovered `wifi_request_tile`, you can quickly build a seed database of 9-11 million records spread across the world in ~12 hours and apply the proximity technique to search from there. Overall, this shortens the time from 1 year to about a week to obtain the 2 billion records. In addition to the original paper, I've also collected data from China using their region-specific endpoint and shapefiles to identify whether a tile falls within its borders to automatically swap endpoints.

<img src="https://github.com/user-attachments/assets/8da21d51-a506-4c32-94b7-b3ae853d65ab" alt="Grafana plot of collected seeds" height=400></img>

By collecting this data over a long period of time, you can identify trends such as the movement of people from rural to urban China, the destruction of Gaza, and the Russian advance on Ukraine.

In terms of individual tracking, by keeping a known BSSID, stalkers are able to find where someone has moved to, given that they bring their router with them.

## Preventing mass surveillance and limiting data exfiltration

The problem of data exfiltration ultimately comes down to the fact that data retrieved from the API can be recursively used to extract more data. This is actually relatively easy to solve - just send down the BSSIDs hashed and salted. Hashing prevents them from getting reused in requests and the salt prevents pre-computed rainbow tables considering BSSIDs only have 48 bits of entropy, even less if you consider the OUI/vendor identification. To add more bits of entropy, [beacondb](https://codeberg.org/beacondb/beacondb/pulls/100) has proposed a BSSID+SSID hash.

For `wifi_request_tile`, the user should prove that they are in or adjacent to the requested tile. This can be done by making the `clls/wloc` response signed, and to require the user to attach a proof that it is able to solve a certain number of hashes from the response. Based on a rough triangulation without signal strength data, the server could approximate the user's tile and allow the request based on proximity (e.g. user is allowed to request tiles ±10 units away). The downside to this is that now Apple has a more accurate idea of your location.

Even with these mitigations, individual access points can still be tracked over time, enabling stalkers.

Most of the time, even without AP-based location service, phones are still able to know their approximate location, either with GPS or cell towers. Using this, when making a request to we could attach the expected tile key. If the user does not know approximately where the router is, they would not be able to get the location. To prevent brute force, at least 3 known BSSIDs need to submitted from the same tile - making it impossible for individual tracking. The performance of the location service is not hurt since it's not possible to do triangulation with less than 3 anchors anyways.

TODO: Implement a real server with these mitigations using the records already exfiltrated from Apple.

### Privacy from Apple

While observed requests have not included any unique identifiers beyond IOS version and iPhone model, it is technically possible to correlate requests from IP addresses to authenticated ones. The number of people with a specific IOS/model combination sharing an IP is probably pretty limited. Removing device identifiers would be a good first step but overall, there isn't much to do especially considering nearly your entire movement range will be cached. TODO: More tests, check if it's possible (probably not) to get location data without revealing location?
