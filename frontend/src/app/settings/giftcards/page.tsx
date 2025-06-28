import Comingsoon from "@/app/components/common/ComingSoon";
import React from "react";

const page = () => {
  return (
    <div className="lg:w-3/4 bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <Comingsoon isEmbedded={true} />;
    </div>
  );
};

export default page;
