import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
    theme: create({
        base: "light",
        brandTitle: "React Financial Charts",
        brandUrl: "https://github.com/sgonzaloc/react-financial-charts",
    }),
});

addons.ready().then(() => {
    setTimeout(() => {
        const closeButton = document.querySelector('button[title^="Hide addons"]') as HTMLElement;

        if (closeButton) {
            const isHidden = sessionStorage.getItem("addons-panel-hidden");
            if (!isHidden) {
                closeButton.click();
                sessionStorage.setItem("addons-panel-hidden", "true");
            }
        }
    }, 1000);
});
