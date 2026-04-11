import { Suspense } from "react";
import { useRouteError } from "react-router";
import Loading from "../components/common/Loading";
import Blocks from "../components/blocks/Blocks";
import { fourOhFourComponent, fourOhOneComponent } from "../config/routes";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

export default function ErrorPage() {
  const error = useRouteError();

  if (error instanceof UnauthorizedError) {
    return (
      <Suspense fallback={<Loading />}>
        <Blocks.FourOhOne
          component={fourOhOneComponent}
          params={{}}
          path="401"
        />
      </Suspense>
    );
  }

  if (error instanceof NotFoundError) {
    return (
      <Suspense fallback={<Loading />}>
        <Blocks.FourOhFour
          component={fourOhFourComponent}
          params={{}}
          path="404"
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Blocks.FourOhFour
        component={fourOhFourComponent}
        params={{}}
        path="404"
      />
    </Suspense>
  );
}
