For Working With Real Time Features:

    [1] Event That's Sent From Server To Us:

        # All In context folder ==>  signals File ==> There Is Comment For Each Event 

    [2] Events That's Sent From Us To Server:
    
        # info event: To Sent Initial Info From User To Server, The Type Of Data is any Like : {test : '2'  , boo : "foo" ..}
        ### But The REQUIRED DATA TO SENT IT FIRST IS : {currentPage : 'whatever' , ip : 'whatever' , fullName : 'whatever'} ==> If Not Sent It Will Make User Info Empty In Admin Dashboard, 

        # more-info: To Sent Info From User To Server That Contains Each Form Info , We Can Use sendDataToServer(data:any, currentPage:string , nextPage:string,  waitingForAdminResponse: Boolean, navigate?: NavigateFunction (from react-router-dom)) function To Do That!

        # send-message: To Receive Message From Admin (Chat) , We Can Use sendMessage(message:string)  function To Do That!




        