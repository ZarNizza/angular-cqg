#This is private tutorial playground, not for public use.

 - contractsServer web-worker - emulates a websocket subscription in background task, generate and send random size contracts data packets to tickProcessor in random intervals.

 - quotesServer web-worker similarly in background task generate and send quotes to tickProcessor. Data flow parameters hardcoded inside modules.

 - tickProcessor web-worker, also in background task, receive contracts from contractsServer, update ContractBook according received data (append/delete items).

 TickProcessor receive quotes from quotesServer, calculate each quote WMA current value and allocate it all in ContractBook.

 After all quotes processing in parcel, tickProcessor convert actual ContractBook data to array and post it to AppComponent in high performance datagrid.



 WMA = weighted moving average price, in this case calculated for last 1000 values. Represented as ratio to the current price (%).

 Performance can be further increased by use SharedArrays for ContractBook.

 Since I'm new to Angular, I decided not to use SharedArrays and write full-fledged application tests yet.


