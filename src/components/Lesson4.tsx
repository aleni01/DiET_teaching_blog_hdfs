import { Play } from "lucide-react";
import Animation from "./Animation_lesson4.tsx";
import { useState } from "react";

export default function App() {
  const [counter, setCounter] = useState(1);

  return (
    <div className="grid grid-cols-3 gap-8 py-8">
      <div className="col-span-1">
        
        <p className="">
          The DataNodes are responsible for storing the individual data blocks
          of files. When a client wants to store data in HDFS, it first sends a
          request to the NameNode. The NameNode then tells the client
          which DataNodes should receive the data. 
          Each DataNode also maintains
          metadata describing which blocks it stores locally. <br />
          <h4>Writing Data to DataNodes</h4>
          <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
            <p className="">
              <Play
                size={18}
                className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
              />{" "}
              Change the client connection slider to select to which DataNode
              the client writes its data.
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
            <>
            <p>Notice how data is written to the selected DataNode.</p>
            <p> 
         ⚠️ In this animation, blocks are written simultaneously and fill the connected DataNode before continuing to the next one. In a real HDFS system, the client would contact the NameNode for every block to determine the appropriate DataNode destination.
        </p>
            <h4 className= "mt-2">Influence of File Size</h4>
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Adjust the file size to how this affects how the DataNodes
                are filled up.
              </p>
              {counter < 3 && (
                <div className="flex justify-center mt-2">
                  <button
                    className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                    onClick={() => setCounter(3)}
                    disabled={counter > 2}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            </>
          )}

        {counter >= 3 && (<>
        <p>
          Larger files are split into more blocks, causing more storage to be used across DataNodes.
        </p>
          
      
        </>

      )}

        {counter >= 3 && ( <>
        <h4 className="mt-2">Influence of Block Size</h4>
        
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                
          Change the block size and observe how the number of stored blocks changes.
              </p>
              {counter < 4 && (
                <div className="flex justify-center mt-2">
                  <button
                    className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                    onClick={() => setCounter(4)}
                    disabled={counter > 3}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
        </>
          )}
         
          
        {counter >= 4 && (<> 
        <p>
          Smaller block sizes create more blocks, increasing the amount of metadata that must be tracked.
        </p>
        <p>
          At first, it may seem beneficial to use very large block sizes to reduce metadata overhead. However, this is not how real systems operate.
        </p>
        <h4 className="mt-2"> Replication is important</h4>

          <p className="mt-1"> The problem is that
          DataNodes may fail, and data blocks can become
          corrupted. To ensure reliability, HDFS stores multiple replicas of each block.</p>
        
        </>)}
          
          {counter >= 4 && (
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                
            
                Change the replication factor to see how blocks are
          replicated across the data centre. The number inside the block indicate its replica number.
              </p>
              {counter < 5 && (
                <div className="flex justify-center mt-2">
                  <button
                    className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                    onClick={() => setCounter(5)}
                    disabled={counter > 4}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
         
          {counter >= 5 && ( <>
          <h4 className="mt-2">Replication Placement Strategy</h4>
           <p>  
          Blocks are replicated according to specific rules:
          The first replica is stored on the DataNode connected to the client.
          The second replica is stored on a DataNode in a different rack.
          The third replica is stored on another DataNode within that same rack.
          Additional replicas follow two guidelines:
          No two replicas are stored on the same DataNode.
          Replicas are distributed across racks to improve fault tolerance.
         
          </p>
          <h4 className="mt-2">Why Block Size matters</h4>
          <p >
          If a block is lost or corrupted, it must be replicated again across the data centre. Smaller blocks limit the amount of data lost during failures. This is why HDFS uses a block size of 128 MB rather than much larger blocks.
        </p>
          
          </>)}

          {counter >= 5 && (
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                
            
                Set the number of files to two and experiment with different
                file sizes, block sizes, and replication factors to observe how the system behaves.
              </p>

              {counter < 6 && (
                <div className="flex justify-center mt-2">
                  <button
                    className="bg-[oklch(0.3816_0.1558_356.93)] px-12 rounded text-[#e7deccfd] cursor-pointer py-2 disabled:cursor-not-allowed"
                    onClick={() => setCounter(6)}
                    disabled={counter > 5}
                  >
                    Next
                  </button>
                </div>
              )}

              
              
             
            </div>

          )}

{counter >= 6 && (
                <p className="mt-2">Explore how all the components act together on the next page.</p>
              )}
        
        </p>
      </div>

      <div className="col-span-2">
        <Animation />
      </div>
    </div>
  );
}
