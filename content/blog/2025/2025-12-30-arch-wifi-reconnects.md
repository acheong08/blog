+++
title = "Weird Network Reconnects on Arch"
+++

```
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5523] device (duti): Activation: successful, device activated.
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5683] device (wlan0): supplicant interface state: internal-starting -> disconnected
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5684] Wi-Fi P2P device controlled by interface wlan0 created
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5685] manager: (p2p-dev-wlan0): new 802.11 Wi-Fi P2P device (/org/freedesktop/NetworkManager/Devices/146)
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5686] device (p2p-dev-wlan0): state change: unmanaged -> unavailable (reason 'managed', managed-type: 'external')
Dec 30 05:43:40 fishy NetworkManager[1364]: <warn>  [1767073420.5686] device (p2p-dev-wlan0): error setting IPv4 forwarding to '0': Success
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5689] device (wlan0): state change: unavailable -> disconnected (reason 'supplicant-available', managed-type: 'full')
Dec 30 05:43:40 fishy NetworkManager[1364]: <info>  [1767073420.5692] device (p2p-dev-wlan0): state change: unavailable -> disconnected (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0093] policy: auto-activating connection 'MyWifi' (134f6382-9241-46b4-90a0-7e052d168eda)
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0100] device (wlan0): Activation: starting connection 'MyWifi' (134f6382-9241-46b4-90a0-7e052d168eda)
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0100] device (wlan0): state change: disconnected -> prepare (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0468] device (wlan0): set-hw-addr: reset MAC address to de:ad:ba:be:ca:fe (preserve)
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0509] device (wlan0): state change: prepare -> config (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0512] device (wlan0): Activation: (wifi) access point 'MyWifi' has security, but secrets are required.
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0512] device (wlan0): state change: config -> need-auth (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0517] device (wlan0): supplicant interface state: disconnected -> inactive
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0517] device (p2p-dev-wlan0): supplicant management interface state: disconnected -> inactive
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0528] device (wlan0): state change: need-auth -> prepare (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0531] device (wlan0): state change: prepare -> config (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0535] device (wlan0): Activation: (wifi) connection 'MyWifi' has security, and secrets exist.  No new secrets needed.
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0541] Config: added 'ssid' value 'MyWifi'
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0541] Config: added 'scan_ssid' value '1'
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0542] Config: added 'bgscan' value 'simple:30:-70:86400'
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0542] Config: added 'key_mgmt' value 'WPA-PSK WPA-PSK-SHA256 SAE'
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.0542] Config: added 'psk' value '<hidden>'
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.6283] device (wlan0): supplicant interface state: inactive -> authenticating
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.6283] device (p2p-dev-wlan0): supplicant management interface state: inactive -> authenticating
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.6830] device (wlan0): supplicant interface state: authenticating -> associating
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.6831] device (p2p-dev-wlan0): supplicant management interface state: authenticating -> associating
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.7385] device (wlan0): supplicant interface state: associating -> completed
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.7385] device (wlan0): Activation: (wifi) Stage 2 of 5 (Device Configure) successful. Connected to wireless network "MyWifi"
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.7385] device (p2p-dev-wlan0): supplicant management interface state: associating -> completed
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.7398] device (wlan0): state change: config -> ip-config (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.7401] dhcp4 (wlan0): activation: beginning transaction (timeout in 45 seconds)
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.7572] dhcp4 (wlan0): state changed new lease, address=192.168.1.104, acd pending
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.9267] dhcp4 (wlan0): state changed new lease, address=192.168.1.104
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.9425] device (wlan0): state change: ip-config -> ip-check (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.9442] device (wlan0): state change: ip-check -> secondaries (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.9444] device (wlan0): state change: secondaries -> activated (reason 'none', managed-type: 'full')
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.9457] device (wlan0): Activation: successful, device activated.
Dec 30 05:49:06 fishy NetworkManager[1364]: <info>  [1767073746.6061] audit: op="connection-update" uuid="bbc81535-f6e4-341f-92ef-7df37432204b" name="Wired connection 1" args="ipv6.addr-gen-mode,ipv6.method,connection.timestamp" pid=14084 uid=1000 result="success"
[ 2327.606933] wlan0: RX AssocResp from de:ad:ba:be:ca:fe (capab=0x1411 status=0 aid=4)
[ 2327.622592] wlan0: associated
[ 2327.706904] wlan0: Limiting TX power to 35 (35 - 0) dBm as advertised by de:ad:ba:be:ca:fe
[ 2331.429787] wlan0: deauthenticating from de:ad:ba:be:ca:fe by local choice (Reason: 3=DEAUTH_LEAVING)
[ 2333.786872] wlan0: authenticate with de:ad:ba:be:ca:fe (local address=de:ad:ba:be:ca:fe)
[ 2333.787662] wlan0: send auth to de:ad:ba:be:ca:fe (try 1/3)
[ 2333.821379] wlan0: authenticated
[ 2333.822532] wlan0: associate with de:ad:ba:be:ca:fe (try 1/3)
[ 2333.930474] wlan0: associate with de:ad:ba:be:ca:fe (try 2/3)
[ 2333.944659] wlan0: RX AssocResp from de:ad:ba:be:ca:fe (capab=0x1411 status=0 aid=1)
[ 2333.957576] wlan0: associated
[ 2333.957667] wlan0: Limiting TX power to 35 (35 - 0) dBm as advertised by de:ad:ba:be:ca:fe
[ 2338.461674] wlan0: deauthenticating from de:ad:ba:be:ca:fe by local choice (Reason: 3=DEAUTH_LEAVING)
[ 2340.751310] wlan0: authenticate with de:ad:ba:be:ca:fe (local address=de:ad:ba:be:ca:fe)
[ 2340.752571] wlan0: send auth to de:ad:ba:be:ca:fe (try 1/3)
[ 2340.786019] wlan0: authenticated
[ 2340.786568] wlan0: associate with de:ad:ba:be:ca:fe (try 1/3)
[ 2340.800918] wlan0: RX AssocResp from de:ad:ba:be:ca:fe (capab=0x1411 status=0 aid=1)
[ 2340.838602] wlan0: associated
[ 2340.838679] wlan0: Limiting TX power to 35 (35 - 0) dBm as advertised by de:ad:ba:be:ca:fe
[ 2344.497748] wlan0: deauthenticating from de:ad:ba:be:ca:fe by local choice (Reason: 3=DEAUTH_LEAVING)
[ 2346.767408] wlan0: authenticate with de:ad:ba:be:ca:fe (local address=de:ad:ba:be:ca:fe)
[ 2346.768118] wlan0: send auth to de:ad:ba:be:ca:fe (try 1/3)
[ 2346.801876] wlan0: authenticated
[ 2346.802617] wlan0: associate with de:ad:ba:be:ca:fe (try 1/3)
[ 2346.813667] wlan0: RX AssocResp from de:ad:ba:be:ca:fe (capab=0x1411 status=0 aid=1)
[ 2346.825683] wlan0: associated
[ 2346.855327] wlan0: Limiting TX power to 35 (35 - 0) dBm as advertised by de:ad:ba:be:ca:fe
[ 2351.528729] wlan0: deauthenticating from de:ad:ba:be:ca:fe by local choice (Reason: 3=DEAUTH_LEAVING)
[ 2357.303297] wlan0: authenticate with de:ad:ba:be:ca:fe (local address=de:ad:ba:be:ca:fe)
[ 2357.304282] wlan0: send auth to de:ad:ba:be:ca:fe (try 1/3)
[ 2357.335522] wlan0: authenticated
[ 2357.336873] wlan0: associate with de:ad:ba:be:ca:fe (try 1/3)
[ 2357.344912] wlan0: RX AssocResp from de:ad:ba:be:ca:fe (capab=0x1011 status=0 aid=1)
[ 2357.358139] wlan0: associated
[ 2357.412622] wlan0: Limiting TX power to 35 (35 - 0) dBm as advertised by de:ad:ba:be:ca:fe
Dec 30 05:43:45 fishy NetworkManager[1364]: <info>  [1767073425.9457] device (wlan0): Activation: successful, device activated.
Dec 30 05:43:49 fishy systemd-networkd[1206]: wlan0: DHCPv4 address 192.168.1.104/24, gateway 192.168.1.1 acquired from 192.168.1.1
Dec 30 05:43:50 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:43:50 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:45:11 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:45:11 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:47:10 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:47:10 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:48:32 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:48:32 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:49:06 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:49:06 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:51:05 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:51:05 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:52:33 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
Dec 30 05:52:33 fishy tailscaled[1477]: LinkChange: major, rebinding. New state: interfaces.State{defaultRoute=enp0s20f0u1c4i2 ifs={duti:[10.8.0.7/24] enp0s20f0u1c4i2:[172.20.10.2/28 172.20.10.5/28 240e:430:2a11:c5dd:5af6:e64a:6c3d:e896/64 240e:430:2a11:c5dd:b890:47ff:fe0a:8ca8/64 llu6] tailscale0:[100.64.0.8/32 fd7a:115c:a1e0::8/128 llu6] wlan0:[192.168.1.104/24]} v4=true v6=true}
```

My internet kept disconnecting and reconnecting in a loop. Only seemed to happen on one specific network in China.

What ended up being the problem was having both `NetworkManager` and `systemd-networkd` active at the same time. I don't know why that was the case but never had problems before. Probably due to this specific network being unstable and thus leading to the race condition.

Solution was to simply

```
sudo systemctl disable --now systemd-networkd.service
sudo systemctl disable --now systemd-resolved.service
sudo systemctl mask systemd-networkd.service
sudo systemctl mask systemd-networkd-varlink.socket
sudo systemctl mask systemd-networkd.socket
```

Posting here so the next person that searches these strings from their logs can find it.

Sometimes, `iwd` and `wpa_supplicant` are also both active. Just disable `iwd`

```
sudo pacman -Rcns iwd
```

You may need to reboot your laptop and later edit connections using `nm-connection-editor` to use `wlp0s20f3` instead of `wlan0`
