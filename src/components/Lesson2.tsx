import Animation from "./Animation_lesson2.tsx";
import {useState} from "react";
import {Play} from "lucide-react";

export default function App() {

    const [counter, setCounter] = useState(1);

return (

<div className="grid grid-cols-3 gap-8 py-8">
      
<div className="col-span-1 ">   
  <p className="mb-2">
    Since the files are usually huge, they do not fit on a single machine. Consequently, they must be split into smaller blocks and distributed across multiple machines. 
  </p>  

  <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
            <p className="">
              <Play
                size={18}
                className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
              />{" "}
              Change the slider to select a file size, then experiment with the block size. How many blocks will a file be split into?
            </p>
            {counter < 2 && (
              <div className="flex justify-center mt-2">
                <button
                  className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                  onClick={() => setCounter(2)}
                  disabled={counter > 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>

    {counter >= 2 && (

    <div>

        <p className="mt-2">In HDFS, files are split into equal-sized blocks. If the file size does not correspond to a multiple of the selected block size, the remaining part is stored in a separate block at its original size, without padding.</p>
        
        <p className="mt-4">
            Next, explore how block size influences the various components of the HDFS architecture. 
        </p>        

    </div>
    )}

</div>

<div className="col-span-2">
  <Animation />
</div>

</div>
);

}
