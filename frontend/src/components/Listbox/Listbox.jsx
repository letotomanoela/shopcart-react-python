import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { AiOutlineCheck } from "react-icons/ai";
import { BsChevronExpand as ChevronUpDownIcon } from "react-icons/bs";

export default function ListboxComponent({ total, itemSelected, setSelected }) {
  const numberList = [...Array(total).keys()];

  


  return (
    <div className="">
      <Listbox value={itemSelected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-[100px] cursor-default rounded-lg bg-slate-200  dark:bg-slate-900 dark:text-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{itemSelected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-200 dark:bg-slate-900 dark:text-white z-30 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {numberList.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-amber-100 text-amber-900"
                        : "text-gray-900 dark:text-slate-50"
                    }`
                  }
                  value={person + 1}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person + 1}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <AiOutlineCheck className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
