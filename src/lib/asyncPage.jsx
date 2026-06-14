import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
export function createAsyncPage(asyncRenderFn) {
  return function AsyncPage() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
      let active = true;
      setElement(null);
      const nextProps = {
        params: Promise.resolve(params),
        searchParams: Object.fromEntries(searchParams.entries())
      };
      Promise.resolve(asyncRenderFn(nextProps)).then((el) => {
        if (active) setElement(el);
      }).catch((err) => {
        console.error("Failed to render page:", err);
        if (active) setError(err);
      });
      return () => {
        active = false;
      };
    }, [params, searchParams]);
    if (error) {
      return /* @__PURE__ */ React.createElement("div", { className: "p-8 text-center text-red-500" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold" }, "Failed to load page"), /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-sm text-gray-500" }, error.message || String(error)));
    }
    if (!element) {
      return /* @__PURE__ */ React.createElement("div", { className: "p-8 text-center text-muted-foreground flex items-center justify-center min-h-[300px]" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-brand-magenta" }));
    }
    return element;
  };
}
