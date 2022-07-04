'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.prevent-focus-stealing');

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // applicationsList
    const applicationsListRow = new Adw.ActionRow({ title: 'Applications List' });
    group.add(applicationsListRow);
    const applicationsListInput = new Gtk.Entry();
    settings.bind(
        'applications-list',
        applicationsListInput,
        'text',
        Gio.SettingsBindFlags.DEFAULT
    );
    applicationsListRow.add_suffix(applicationsListInput);
    applicationsListRow.activatable_widget = applicationsListInput;

    // Add our page to the window
    window.add(page);
}