import { useNavigate } from "@tanstack/react-router";
import { BlockComponentStandardProps } from "@/components/blocks/Block";
import useRedirectBlockData from "@/components/blocks/BuildRedirectBlock/data";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

function RedirectBlock(config: BlockComponentStandardProps) {
  const result = useRedirectBlockData(config);
  const navigate = useNavigate();

  const blockData = result.type === "success" ? result.blockData : undefined;
  const { destination, message } = blockData || {};

  useEffect(() => {
    if (message) {
      toast(message);
    }
    if (destination) {
      navigate({
        to: destination,
        replace: true,
      });
    }
  }, [destination, navigate, message]);

  return <></>;
}

export default RedirectBlock;
