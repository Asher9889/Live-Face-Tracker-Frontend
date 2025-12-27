| Meaning                  | Color                 |
| ------------------------ | --------------------- |
| Online / OK              | Green (`emerald-600`) |
| Warning / Low confidence | Amber (`amber-500`)   |
| Error / Offline          | Red (`red-600`)       |
| Primary action           | Blue (`blue-600`)     |


# Redux for storing BBOX data
- `Redux stores current truth, not raw events.`
- WS = event firehose
- Redux = current world snapshot
- UI = pure projection of snapshot
- You are not “rendering bbox events”.
- You are rendering camera reality.