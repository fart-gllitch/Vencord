/*
 * Vencord, a Discord client mod
 * Script to automatically append customizable text to user messages.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

export default definePlugin({
    name: "AutoAppendText",
    authors: ["aj"],
    description: "Automatically appends customizable text to every message sent by the user.",
    settings: definePluginSettings({
        appendText: {
            description: "Text to append to each message",
            type: OptionType.STRING,
            default: "-# poop"
        }
    }),
    patches: [
        {
            find: "sendMessage",
            replacement: {
                match: /sendMessage\(.*\)/,
                replace: "$self.appendTextAndSend(content)"
            }
        }
    ],
    appendTextAndSend(content: string): string {
        // Fetch the user-defined text to append
        const appendText = this.settings.store.appendText;
        const modifiedContent = `${content} ${appendText}`;
        // Call the original sendMessage function with the modified content
        return this.originalSendMessage(modifiedContent);
    },
    onLoad() {
        // Preserve the original sendMessage method
        this.originalSendMessage = window.sendMessage;
    },
    onUnload() {
        // Restore the original sendMessage method on plugin unload
        if (this.originalSendMessage) {
            window.sendMessage = this.originalSendMessage;
        }
    }
});
