import { lazy } from "react";

const LazyLoadedInputDateRangeArray = lazy(
  () => import("@/components/inputs/InputDateRangeArray"),
);

const LazyLoadedInputImageSelectArray = lazy(
  () => import("@/components/inputs/InputImageSelectArray"),
);

const LazyLoadedInputItemArray = lazy(
  () => import("@/components/inputs/InputItemArray"),
);

const LazyLoadedInputRadio = lazy(
  () => import("@/components/inputs/InputRadio"),
);

const LazyLoadedInputReferenceFeed = lazy(
  () => import("@/components/inputs/InputReferenceFeed"),
);

const LazyLoadedInputOverrideLink = lazy(
  () => import("@/components/inputs/InputOverrideLink"),
);

const LazyLoadedInputTagArray = lazy(
  () => import("@/components/inputs/InputTagArray"),
);

const LazyLoadedInputText = lazy(() => import("@/components/inputs/InputText"));

const LazyLoadedInputTextArea = lazy(
  () => import("@/components/inputs/InputTextArea"),
);

const LazyLoadedInputToggle = lazy(
  () => import("@/components/inputs/InputToggle"),
);

const Inputs = {
  DateRangeArray: LazyLoadedInputDateRangeArray,
  ImageSelectArray: LazyLoadedInputImageSelectArray,
  ItemArray: LazyLoadedInputItemArray,
  Radio: LazyLoadedInputRadio,
  ReferenceFeed: LazyLoadedInputReferenceFeed,
  OverrideLink: LazyLoadedInputOverrideLink,
  TagArray: LazyLoadedInputTagArray,
  Text: LazyLoadedInputText,
  TextArea: LazyLoadedInputTextArea,
  Toggle: LazyLoadedInputToggle,
};

export default Inputs;
