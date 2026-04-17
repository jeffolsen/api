import { useNavigate } from "react-router";
import { BlockComponentStandardProps } from "../Block";
import useRedirectBlockData from "./data";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

function RedirectBlock({
  component,
  params,
  path,
}: BlockComponentStandardProps) {
  const result = useRedirectBlockData({ component, params, path });
  const navigate = useNavigate();

  const blockData = result.type === "success" ? result.blockData : undefined;
  const { destination, message } = blockData || {};

  useEffect(() => {
    if (message) {
      toast(message);
    }
    if (destination) {
      navigate(destination, { replace: true });
    }
  }, [destination, navigate, message]);

  return <></>;
}

export default RedirectBlock;
