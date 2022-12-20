import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function Profile() {
  const title = "Profile";

  useEffect(() => {
    async function init() {
    }
    init();
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="page-container">
        <div className="title">
          <h1>Profile</h1>
        </div>
        <p>This is the profile page</p>
      </div>
    </>
  );
}