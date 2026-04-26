import { lazy } from "react";

const LazyLoadedInputDateRangeArray = lazy(
  () => import("./InputDateRangeArray"),
);

const LazyLoadedInputImageSelectArray = lazy(
  () => import("./InputImageSelectArray"),
);

const LazyLoadedInputItemArray = lazy(() => import("./InputItemArray"));

const LazyLoadedInputRadio = lazy(() => import("./InputRadio"));

const LazyLoadedInputReferenceFeed = lazy(() => import("./InputReferenceFeed"));

const LazyLoadedInputOverrideLink = lazy(() => import("./InputOverrideLink"));

const LazyLoadedInputTagArray = lazy(() => import("./InputTagArray"));

const LazyLoadedInputText = lazy(() => import("./InputText"));

const LazyLoadedInputTextArea = lazy(() => import("./InputTextArea"));

const LazyLoadedInputToggle = lazy(() => import("./InputToggle"));

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
