// Tells Firefox to run firefox-loading-bar.cfg from its install folder (Firefox "autoconfig").
// https://github.com/ZIGAG1999/firefox-loading-bar
pref("general.config.filename", "firefox-loading-bar.cfg");
pref("general.config.obscure_value", 0);
// Needed for the script to read page-load progress in Firefox's interface.
pref("general.config.sandbox_enabled", false);
