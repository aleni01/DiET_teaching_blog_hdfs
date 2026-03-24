import { Play } from "lucide-react";
import Animation from "./Animation_lesson3.tsx";
import { useState } from "react";

export default function App() {
  const [counter, setCounter] = useState(1);

  return (
    <div className="grid grid-cols-3 gap-8 py-8">
      <div className="col-span-1">
        <p className="mb-2">
          The NameNode acts as a coordinator and must store three types of
          informations. First, it stores the namespace tree.
        </p>
        <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
          <p className="">
            <Play
              size={18}
              className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
            />{" "}
            Open the "NameSpace Tree" toggle in the NameNode panel to see how the
            file namespace is stored.
          </p>
         {counter<2 && (<div className="flex justify-center mt-2">
            <button
              className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
              onClick={() => setCounter(2)}
              disabled={counter > 1}
            >
              Next
            </button>
          </div>)}
        </div>
        {counter >= 2 && (
          <>
            <p className="mb-2">
              As you can see, it has a tree-like structure that keeps track of
              which files belong to which user.
            </p>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p>
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Open the "File Metadata" toggle and open the individual toggles
                for the four files.{" "}
              </p>
            {counter<3 &&   (<div className="flex justify-center mt-2">
                <button
                  className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                  onClick={() => setCounter(3)}
                  disabled={counter > 2}
                >
                  Next
                </button>
              </div>)}
            </div>
          </>
        )}
        {counter >= 3 && (
          <>
            <p className="mb-4">
              You see that it also stores metadata about the individual files.
            </p>
            <p >
              The second task of the NameNode is to store a mapping between the
              file and the blocks into which it was split.
            </p>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p>
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Go to the "File Metadata" toggle again, and click on the
                "Blocks" toggle in each file.{" "}
              </p>
            { counter <4 &&  (<div className="flex justify-center mt-2">
                <button
                  className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                  onClick={() => setCounter(4)}
                  disabled={counter > 3}
                >
                  Next
                </button>
              </div>)}
            </div>
          </>
        )}
        {counter >= 4 && (
          <>
            <p>
              There, you can see the mapping that is done. You will also see how
              many blocks are stored for each file size based on the block size.
            </p>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p>
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Start changing the block size, selecting different sizes for
                each file, and observe how keeping track of the blocks changes.
                The total number of blocks that the NameNode must keep track of
                is shown in the metadata statistics at the bottom of the
                NameNode panel.{" "}
              </p>
             { counter<5 && (<div className="flex justify-center mt-2">
                <button
                  className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                  onClick={() => setCounter(5)}
                  disabled={counter > 4}
                >
                  Next
                </button>{" "}
              </div>)}
            </div>
          </>
        )}
        {counter >= 5 && (
          <>
            <p>
              As you can see, the number of blocks increases significantly if
              you select a small block size. The storage usage shown in the
              bottom right corner of the NameNode panel shows how much memory is
              required to store all this information. In this example, it is
              still low because we are only dealing with four files. However,
              imagine if this system had to store millions of files; this number
              would get be quite big.{" "}
            </p>{" "}
            <p className="mt-4">
              The last thing that the NameNode has to track is the block
              mapping. This means it has to track on which DataNodes the blocks
              are stored on.
            </p>
          </>
        )}
      </div>
      <div className="col-span-2">
        <Animation />
      </div>
    </div>
  );
}
