# URL Parameters - Safari Extension

*Read this in other languages: [Português](README.pt-br.md), [Español](README.es.md)*

A Safari extension that analyzes the current tab's URL, displaying its components in an organized way with the option to copy each item to the clipboard.

## Features

- **Complete URL Analysis**: Displays all URL components in an organized manner
  - Protocol (http, https, etc.)
  - Host/Domain
  - Port
  - Path and segments
  - Query strings (GET parameters)
  - Fragments (hash)
  - Authentication (when present)

- **Automatic Decoding**: URL-encoded values are automatically decoded and displayed

- **Copy to Clipboard**: Each item has a button to copy its value

- **Native Interface**: Design that follows macOS/Safari visual style, with dark mode support

## Installation

### Prerequisites

- macOS 11.0 or higher
- Xcode 12.0 or higher
- Safari 14.0 or higher

### Step by Step

1. **Prepare Xcode (first time)**

   If this is your first time using Xcode or after an update, run:

   ```bash
   xcodebuild -runFirstLaunch
   ```

2. **Convert to Xcode Project**

   Navigate to the project folder and run:

   ```bash
   cd url-parameters
   xcrun safari-web-extension-converter . --project-location ../ --app-name "URL Parameters" --bundle-identifier com.yourdomain.urlparameters
   ```

   This command will create an Xcode project in the parent folder with the necessary structure for a Safari Web Extension.

3. **Open in Xcode**

   ```bash
   open "../URL Parameters/URL Parameters.xcodeproj"
   ```

4. **Configure the Project**

   - Click on the "URL Parameters" project in the left panel (blue icon)
   - Select the "URL Parameters" target
   - Go to the "Signing & Capabilities" tab
   - Under "Team", select your Apple ID (or add an account)
   - Repeat for the "URL Parameters Extension" target

5. **Build and Run**

   - Press `Cmd + R` to build and run
   - The app will be installed and you can enable the extension in Safari

6. **Enable in Safari**

   - Open Safari → Settings → Extensions
   - Check the "URL Parameters" box
   - Allow the extension on all sites or your desired sites

### Developer Mode (for testing)

If you want to test without signing with an Apple ID:

1. Safari → Settings → Advanced → Show Develop menu
2. Develop → Allow Unsigned Extensions
3. Rebuild the project in Xcode

## Project Structure

```
url-parameters/
├── manifest.json              # Extension configuration
├── background.js              # Background script
├── popup/
│   ├── popup.html            # Popup interface
│   ├── popup.css             # Styles (with dark mode support)
│   └── popup.js              # URL parsing logic
├── icons/
│   ├── icon.svg              # Source icon (SVG) - light mode
│   ├── icon-dark.svg         # Source icon (SVG) - dark mode
│   ├── icon-16.png           # Icons in various sizes
│   ├── icon-32.png
│   ├── icon-48.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-256.png
│   ├── icon-512.png
│   ├── icon-*-dark.png       # Dark mode icons
│   └── generate-icons.sh     # Script to regenerate icons
├── update-xcode-icons.sh     # Script to update icons in Xcode
└── README.md
```

## Usage

1. Navigate to any page in Safari
2. Click the extension icon in the toolbar
3. See the URL broken down into its parts
4. Click the copy button (⎘) to copy any value
5. Use the "Copy URL" button to copy the complete URL

## Examples

For a URL like:
```
https://example.com:8080/api/users?name=Jo%C3%A3o&age=30#section1
```

The extension will display:

| Component | Value |
|-----------|-------|
| Protocol | https |
| Host | example.com |
| Port | 8080 |
| Path | /api/users |
| Segment 1 | api |
| Segment 2 | users |
| name | João (decoded from Jo%C3%A3o) |
| age | 30 |
| Hash | section1 |

## Development

### Regenerate Icons

If you modify the SVG icon, regenerate the PNGs:

```bash
cd icons
./generate-icons.sh
```

To install the conversion tool (optional, improves quality):

```bash
brew install librsvg
```

### Update Icons in Xcode

After regenerating icons, update them in the Xcode project:

```bash
./update-xcode-icons.sh
```

### Testing Changes

After making changes to web files (HTML, CSS, JS):

1. In Xcode, clean the build: `Cmd + Shift + K`
2. Rebuild: `Cmd + R`
3. If necessary, disable and re-enable the extension in Safari

### Troubleshooting

**Error "A required plugin failed to load":**
```bash
xcodebuild -runFirstLaunch
```

**Extension doesn't appear in Safari:**
1. Check if the app is running (appears in the Dock)
2. Go to Safari → Settings → Extensions and enable it

**Icon doesn't update:**
1. Clean the build in Xcode (`Cmd + Shift + K`)
2. Delete the app in ~/Library/Containers/
3. Rebuild

## License

MIT License - feel free to use and modify.

## Contributing

Contributions are welcome! Open an issue or pull request.
