+++
title = "Hyprland workspace groups/offsets (Hyprspace)"
+++

Expands Hyprland beyond the limit of 10 workspaces

```bash
#!/bin/bash

# Check if XDG_RUNTIME_DIR is set
if [ -z "$XDG_RUNTIME_DIR" ]; then
 XDG_RUNTIME_DIR="/tmp"
fi

OFFSET_FILE="$XDG_RUNTIME_DIR/hypr/workspace_offset"

get_new_workspace() {
  local workspace_num="$1"

  if [ ! -f "$OFFSET_FILE" ]; then
    echo "0" > "$OFFSET_FILE"
  fi

  local offset_value
  offset_value=$(cat "$OFFSET_FILE")

  if ! [[ "$offset_value" =~ ^-?[0-9]+$ ]]; then
    echo "Error: Invalid offset value in file."
    return 1
  fi

  echo $((offset_value*10 + workspace_num))
}

offset() {
  if [ -z "$1" ]; then
    echo "Usage: offset <integer>"
    return 1
  fi

  if ! [[ "$1" =~ ^-?[0-9]+$ ]]; then
    echo "Error: Argument must be an integer."
    return 1
  fi

  mkdir -p "$(dirname "$OFFSET_FILE")"
  echo "$1" > "$OFFSET_FILE"
}

switch() {
  if [ -z "$1" ]; then
    echo "Usage: switch <integer>"
    return 1
  fi

  if ! [[ "$1" =~ ^-?[0-9]+$ ]]; then
    echo "Error: Argument must be an integer."
    return 1
  fi

  local new_workspace
  new_workspace=$(get_new_workspace "$1") || return 1

  hyprctl dispatch workspace "$new_workspace"
}

move() {
  if [ -z "$1" ]; then
    echo "Usage: move <integer>"
    return 1
  fi

  if ! [[ "$1" =~ ^-?[0-9]+$ ]]; then
    echo "Error: Argument must be an integer."
    return 1
  fi

  local new_workspace
  new_workspace=$(get_new_workspace "$1") || return 1

  hyprctl dispatch movetoworkspace "$new_workspace"
}

case "$1" in
  "offset")
    offset "$2"
    ;;
  "move")
    move "$2"
    ;;
  "switch")
    switch "$2"
    ;;
  *)
    echo "Usage: $0 {offset|switch} <integer>"
    exit 1
    ;;
esac

exit 0

```

```hyprlang
# Switch workspaces with mainMod + [0-9]
bind = $mainMod, 1, exec, hyprspace switch 1
bind = $mainMod, 2, exec, hyprspace switch 2
bind = $mainMod, 3, exec, hyprspace switch 3
bind = $mainMod, 4, exec, hyprspace switch 4
bind = $mainMod, 5, exec, hyprspace switch 5
bind = $mainMod, 6, exec, hyprspace switch 6
bind = $mainMod, 7, exec, hyprspace switch 7
bind = $mainMod, 8, exec, hyprspace switch 8
bind = $mainMod, 9, exec, hyprspace switch 9
bind = $mainMod, 0, exec, hyprspace switch 10

# Move active window to a workspace with mainMod + SHIFT + [0-9]
bind = $mainMod SHIFT, 1, exec, hyprspace move 1
bind = $mainMod SHIFT, 2, exec, hyprspace move 2
bind = $mainMod SHIFT, 3, exec, hyprspace move 3
bind = $mainMod SHIFT, 4, exec, hyprspace move 4
bind = $mainMod SHIFT, 5, exec, hyprspace move 5
bind = $mainMod SHIFT, 6, exec, hyprspace move 6
bind = $mainMod SHIFT, 7, exec, hyprspace move 7
bind = $mainMod SHIFT, 8, exec, hyprspace move 8
bind = $mainMod SHIFT, 9, exec, hyprspace move 9
bind = $mainMod SHIFT, 0, exec, hyprspace move 10

# Set offsets
bind = $mainMod CONTROL, 1, exec, hyprspace offset 0
bind = $mainMod CONTROL, 2, exec, hyprspace offset 1
bind = $mainMod CONTROL, 3, exec, hyprspace offset 2
bind = $mainMod CONTROL, 4, exec, hyprspace offset 3
bind = $mainMod CONTROL, 5, exec, hyprspace offset 4
bind = $mainMod CONTROL, 6, exec, hyprspace offset 5
bind = $mainMod CONTROL, 7, exec, hyprspace offset 6
bind = $mainMod CONTROL, 8, exec, hyprspace offset 7
bind = $mainMod CONTROL, 9, exec, hyprspace offset 8
```
