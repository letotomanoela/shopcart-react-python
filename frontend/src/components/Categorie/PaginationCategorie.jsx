import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";


const PaginationCategorie = () => {
  return (
    <div className="w-full flex itels-center justify-center my-5 py-6 space-x-4">
      <RoundButton number={<RiArrowLeftSLine className="text-3xl text-green-900" />} />
      <RoundButton number="1" active={true} />
      <RoundButton number="2"  />
      <RoundButton number="3"  />
      <RoundButton number={<RiArrowRightSLine className="text-3xl text-green-900" />} />
    </div>
  );
};

export default PaginationCategorie;

function RoundButton({ number, active }) {
  return (
    <div
      className={`w-12 h-12 cursor-pointer rounded-full text-xl flex items-center justify-center border-2 border-green-900  ${
        active && " text-white bg-green-900"
      }`}
    >
      {number}
    </div>
  );
}
