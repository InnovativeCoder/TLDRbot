import React from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { Textarea } from "@material-tailwind/react";

export default function notes() {
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Hey");
  };
  return (
    <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
      <form onSubmit={submitHandler}>
        {/* <textarea class=" resize-y w-96 h-96 rounded-md"></textarea> */}
        {/* <label for="exampleFormControlTextarea1" class="form-label inline-block mb-2 text-gray-700"
      >Example textarea</label
    > */}
        <Textarea
          class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="Transcribed text"
        />
        <button className="bg-black text-white p-3 rounded-sm mt-3">
          Submit
        </button>
      </form>
    </Main>
  );
}
