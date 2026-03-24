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
          of the files. If a client wants to store its data on HDFS, it sends a
          request to the NameNode and the NameNode then tells the client on
          which DataNodes to store the data. The DataNode itself also has some
          metadata where it keeps track of which blocks it has stored. <br />
          <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4">
            <p className="">
              <Play
                size={18}
                className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
              />{" "}
              Change the client connection slider to change to which DataNode
              the client is directed to write his data.
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
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4 mt-2">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                Now adapt the file size to see how this influences how DataNodes
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
          )}

        {counter >= 3 && ( <p> 
            The animation is simplified, as all blocks are filled into at the
          same time and just fill up the DataNode the client is connected to and
          afterwards continue with the next DataNode, but in reality for each
          block a client wants to write, it would need to request at the
          NameNode to which DataNode it should connect to.
        </p>)}

        {counter >= 3 && (
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4 mt-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                
          Adapt the block size to see how this changes the amount of blocks
          stored. 
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
          )}
         
          
        {counter >= 4 && (<> 
            <p> Until now, it seems quite useful to just select a big block
          size, so that the NameNode and the DataNode have to store less data.
          But this is not quite what is done in reality. </p>
          <p className="mt-1"> The problem is that
          DataNodes can stop to work or the individual data blocks can get
          corrupted, and therefore you want to store the blocks multiple times
          to be sure that there is always a replica that is avlailable and not
          corrupted.</p>
        
        </>)}
          
          {counter >= 4 && (
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4 mt-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                
            
                Change the replication factor to see how blocks are
          replicated across the data center. The number inside the block shows which replica it is.
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
         
          {counter >= 5 && ( <> <p className="mt-2">  As you can see, the data blocks seems to be replicated according to
          some specific rules. The first replica is stored on the DataNode the
          client is connected to, the second rreplica is stored on a DataNode
          that is on another rack and the third replica is stored on the same
          rack as the second replica, but on a different DataNode. From the
          fourth replica on, the NameNode tries to follow two guidelines, namely
          to not store two replicas on the same DataNode and to store replicas
          on at most two DataNodes of a rack. 
          </p><p className="mt-2">
          The problem is that if a data block is corrupted or lost, we need to
          replicate it over the data center. And therefore it would be quite
          good if the amount of lost data is kept small. This is the reason why
          the selected block size is 128 MB and not a bigger one. </p>
          
          </>)}

          {counter >= 5 && (
            <div className="bg-[oklch(0.8335_0.026_84.59)] rounded-xl text-[oklch(0.3816_0.1558_356.93)] px-4 py-4 mt-4">
              <p className="">
                <Play
                  size={18}
                  className="inline text-[oklch(0.3816_0.1558_356.93)] fill-[oklch(0.3816_0.1558_356.93)]"
                />{" "}
                
            
                Now change the number of files to two and experiment with different
                settings for the two files together to see how the system behaves.
              </p>
             
            </div>

          )}

        
        </p>
      </div>

      <div className="col-span-2">
        <Animation />
      </div>
    </div>
  );
}
