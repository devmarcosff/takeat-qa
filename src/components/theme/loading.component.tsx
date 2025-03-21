import { IconTakeatFilled } from "takeat-design-system-ui-kit";
import { LoadingWrapper } from "./ThemeProviderWrapper";

export default function LoadingTakeat() {
  return <LoadingWrapper className="flex items-center justify-center w-full h-screen"><IconTakeatFilled className="text-takeat-primary-default fill-takeat-primary-default text-[95px]" /></LoadingWrapper>
}