import { useNavigate } from "react-router";
import { BlockStandardProps } from "../Block";
import useRedirectBlockData from "./data";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

function RedirectBlock({ component, params, path }: BlockStandardProps) {
  const { blockData } = useRedirectBlockData({ component, params, path });
  const navigate = useNavigate();
  const { destination, message } = blockData;

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
