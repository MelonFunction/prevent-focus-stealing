'use strict';

const Gio = imports.gi.Gio;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


class Extension {
    constructor() {
        this._handles = [] // event handles
        this._focused = null; // last window focused

        this.applicationsList = "";
    }

    readSettings() {
        this.applicationsList = this.settings.get_string("applications-list");
    }

    enable() {
        log(`enabling ${Me.metadata.name}`);

        this.settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.prevent-focus-stealing');
        this.settings.connect("changed::applications-list", () => { this.readSettings(); });
        this.readSettings();

        this._handles.push(global.display.connect('notify::focus-window', () => {
            let focused = global.display.get_focus_window();
            if (focused == null) {
                return;
            }

            let wmclass = focused.get_wm_class();

            let rect = focused.get_frame_rect();
            let [x, y] = global.get_pointer();
            let mouseFocus = (x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height)

            this.applicationsList.split(",").forEach((v) => {
                log(wmclass, v, wmclass == v, mouseFocus);
                if ((wmclass == v.trim()) && !mouseFocus) { // previous focus
                    if (this._focused && this._focused.activate) {
                        this._focused.activate(global.get_current_time());
                    }
                } else { // new focus
                    this._focused = focused;
                }
            })
        }));
    }


    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._handles.splice(0).forEach(h => global.window_manager.disconnect(h));
        this.settings = null;
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);

    return new Extension();
}
