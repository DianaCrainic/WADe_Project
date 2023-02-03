import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function PageNotFound() {
    const title = "Page Not Found";

    return (
        <HelmetProvider>
            <>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <div className="page-container" >
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                </div>
            </>
        </HelmetProvider>
    )
}