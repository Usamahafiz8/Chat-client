export const ApiList = {
    admin: {
      login: "/admin/login", // POST
      getUsers: "/admin/users", // GET
      getConversations: (AdminID :  string|undefined) => {
        return `/admin/conversations/${AdminID}`; // GET
      },
      sendMassage: (conversationId: string) => {
        return `/admin/conversation/send-message/` + conversationId; //post
      },
    },
    user: {
      registerOrLogin: "/user/register-or-login", //post
      getadmin: "/user/admins", //get
    },
    StartConversation: "/user/start-conversation", //post
  
    sendmassage: (conversationId: string) => {
      return `/user/conversation/send-message/` + conversationId; //post
    },
    GetMassages: (conversationId: string) => {
      return `/conversations/messages/` + conversationId; //get
    },
    Users: {
      startConversation: `/user/start-conversation`, //post
      getMassages: (conversationId: string) => {
        return `/conversations/messages/`+conversationId; //get
      },
      sendMassage: (conversationId: string) => {
        return `/user/send-message/` + conversationId; //post
      },
    },
  };
  
  
  // api/user/conversation/send-message/:conversationId