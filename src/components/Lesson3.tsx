import { Play } from "lucide-react";
import Animation from "./Animation_lesson3.tsx";
import { useState } from "react";

export default function App() {
  const [counter, setCounter] = useState(1);

  return (
    <div className="grid grid-cols-3 gap-8 py-8">
      <div className="col-span-1">
        <p className="mb-2">
          The NameNode acts as a coordinator and stores three types of
          information.
          <h4>Namespace Tree</h4> 
          First, it stores the namespace tree, which represents how files are organised.
        </p>
        <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
          <p className="">
            <Play
              size={18}
              className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
            />{" "}
            Open the "NameSpace Tree" toggle in the NameNode panel.
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
              The namespace tree has a tree-like structure that keeps track of
              which files belong to each user.
            </p>
            <h4>File Metadata</h4>
            <p>The NameNode also stores metadata about individual Files.</p>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
            
              <p>
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Open the "File Metadata" toggle and expand the individual toggles
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
              Each file contains metadata describing its properties.
            </p>
            <h4>File-to-block Mapping</h4>
            <p >
              The second task of the NameNode is to maintain a mapping between the
              files and the blocks into which they was split.
            </p>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p>
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Within the "File Metadata" toggle, open the
                "Blocks" toggle for each file.{" "}
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
            <p className="mb-2">
              You see how
              many blocks each file contains based on the selected block size.
            </p>
              <h4>Effect of Block Size</h4>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p>
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Change the block size by selecting different sizes for
                each file. {" "}
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
            Notice how the number of blocks changes. The total number of blocks tracked by NameNode
                is displayed in the metadata statistics at the bottom of the
                NameNode panel.
            </p>
            <p className="mb-2">
              Smaller block sizes significantly increase the number of blocks that must be tracked. The storage usage shown in the bottom-right corner of the NameNode panel indicates how much memory is required to store this metadata. While the usage is small for four files, it would become much larger in systems storing millions of files. 
              {" "}
            </p>{" "}
            <h4>Block Mapping</h4>
            <p className="">
              Finally, the NameNode tracks where each block
              is stored by maintaining a mapping between blocks and the DataNodes that store them.
            </p>

            <p className="mt-2">
              Explore how the data blocks are stored on the DataNodes on the next page.
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
