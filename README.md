# firefox-loading-bar

A real-progress **loading bar for Firefox's address bar**, with a breathing glow at its tip.

Chromium-based browsers like Helium show a thin progress bar along the bottom of the address bar while a page loads. Firefox doesn't. This adds one that:

- **Follows the page's real loading progress.** It moves when the page is actually loading something, and stalls when the site stalls.
- **Finishes smoothly.** When the page is done, the bar fills the rest of the way from wherever it really is, then retracts to the right and fades.
- **Has a breathing glow** at its tip: a near-white core with a warm bloom that pulses on a ~1.33 s cycle while the page loads.
- **Uses Firefox's colors:** a thin gradient from dim violet into a warm orange tip.
- **Follows the current tab.** Switching tabs shows the new tab's loading state.

It's two small pieces: a style file (`userChrome.css`) that draws the bar, and a short script that tells it how far along the page is. Style files alone can't see load progress, so the script is what makes the bar accurate.

## How progress is measured

Firefox only reports byte totals to its interface now and then, so the script builds progress from several real loading signals, the way Chromium's bar does:

| Stage | Bar |
| --- | --- |
| You click a link or reload | 10% |
| The new page starts arriving | 30% |
| Each resource the page loads (scripts, images, data) | a small step toward 85% |
| The page's own document finishes | 85% |
| Everything finishes | fills to 100%, then retracts |

Every step comes from real loading activity. If a site freezes, those signals stop, and so does the bar.

## Install

Tested on **Firefox 156 on Windows 11**. It should work on other recent versions and systems, but those haven't been tested.

### 1. The style file

1. In Firefox, go to `about:config` and set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
2. Go to `about:support` and click **Open Folder** next to **Profile Folder**.
3. Make a folder called `chrome` there if it doesn't exist.
4. Copy `chrome/userChrome.css` from this repo into it. **If you already have a `userChrome.css`, paste this one's contents at the end of yours instead.**

### 2. The script

The script uses Firefox's built-in [autoconfig](https://support.mozilla.org/kb/customizing-firefox-using-autoconfig) feature, which runs one file from Firefox's install folder. Copy the contents of `install/` into that folder (admin rights needed), then **fully restart Firefox**.

**Windows** (in an admin PowerShell, from the repo folder):

```powershell
Copy-Item 'install\firefox-loading-bar.cfg' 'C:\Program Files\Mozilla Firefox\'
Copy-Item 'install\defaults\pref\firefox-loading-bar-prefs.js' 'C:\Program Files\Mozilla Firefox\defaults\pref\'
```

**macOS:**

```sh
sudo cp install/firefox-loading-bar.cfg /Applications/Firefox.app/Contents/Resources/
sudo cp install/defaults/pref/firefox-loading-bar-prefs.js /Applications/Firefox.app/Contents/Resources/defaults/pref/
```

**Linux** (install folder varies, commonly `/usr/lib/firefox` or `/usr/lib64/firefox`):

```sh
sudo cp install/firefox-loading-bar.cfg /usr/lib/firefox/
sudo cp install/defaults/pref/firefox-loading-bar-prefs.js /usr/lib/firefox/defaults/pref/
```

Snap and Flatpak versions of Firefox don't let you add files to the install folder, so the script won't work there.

**If you already use autoconfig** (another `general.config.filename` in `defaults/pref`), only one config file can be active. Paste this script's code (everything after its first line) at the end of your existing config file instead.

## Safety

The script is short and commented, so read it before installing. It:

- only listens to page-load progress for the current tab and passes a number to the style file,
- makes **no network requests**, reads or writes **no files**, and sends **no data** anywhere.

Autoconfig scripts run with full access to Firefox's interface, which is why the script needs `general.config.sandbox_enabled` set to `false`. That's also why it lives in Firefox's install folder: changing files there needs admin rights, so other programs on your computer can't quietly edit it. That's safer than script loaders that run scripts from your profile folder, which any program running as you can modify.

If a Firefox update ever breaks the script, Firefox still starts and works normally. You just won't see the bar.

## Uninstall

1. Delete `firefox-loading-bar.cfg` and `defaults/pref/firefox-loading-bar-prefs.js` from Firefox's install folder (admin rights needed).
2. Remove the loading bar section from your `userChrome.css`.
3. Restart Firefox.

## License

[MIT](LICENSE)
