import "styled-components";
import { DEFAULT_THEME } from "takeat-design-system-ui-kit";

type UiKitTheme = typeof DEFAULT_THEME;

declare module "styled-components" {
    export interface DefaultTheme extends UiKitTheme {
        _?: never;
    }
}
