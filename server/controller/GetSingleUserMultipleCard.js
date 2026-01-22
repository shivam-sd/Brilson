const CardProfileModel = require("../models/CardProfile");


const getLoggedInUserCards = async (req, res) => {
    try {
        const userId = req.user; 
        
        const cards = await CardProfileModel.find({ owner: userId })
        .sort({ createdAt: -1 });
        
        return res.status(200).json({
      success: true,
      count: cards.length,
      cards,
    });
} catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};



const getAllUsersWithTheirCards = async (req, res) => {
  try {
    const data = await CardProfileModel.aggregate([
      {
        $match: { isActivated: true } 
      },
      {
        $group: {
          _id: "$owner",
          cards: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          profile: {
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone"
          },
          cards: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      usersCount: data.length,
      data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};









const getoneUserMultipleCards = async (req, res) => {
  try {
    const { userId } = req.params;

    const cards = await CardProfileModel.find({ owner: userId });

    if (!cards.length) {
      return res.status(404).json({ message: "No cards found" });
    }

    

    return res.status(200).json({
      success: true,
      userId,
      cards
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};




module.exports = {getLoggedInUserCards, getAllUsersWithTheirCards, getoneUserMultipleCards};








// {
//     "success": true,
//     "usersCount": 3,
//     "data": [
//         {
//             "cards": [
//                 {
//                     "_id": "696b21ee91f5f119f3dec31d",
//                     "cardId": "CARD_4361698237",
//                     "activationCode": "14H9ENF4",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/CARD_4361698237",
//                     "isDownloaded": true,
//                     "createdAt": "2026-01-17T05:45:18.755Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-17T07:43:57.032Z",
//                     "activatedAt": "2026-01-17T05:46:52.729Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "shivam-maurya-card4361698237-1768628812734",
//                     "tempSessionId": "card43616982371768628812729-1768628812729",
//                     "profile": {
//                         "name": "Shivam",
0//                         "phone": "06394993317",
//                         "email": "shivam@gmail.com",
//                         "bio": "",
//                         "about": "",
//                         "city": "Noida",
//                         "twitter": "",
//                         "instagram": "",
//                         "linkedin": "",
//                         "website": ""
//                     }
//                 },
//                 {
//                     "_id": "696b42333aaaaee51a817d77",
//                     "activationCode": "P3TXURGA",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/P3TXURGA",
//                     "isDownloaded": true,
//                     "createdAt": "2026-01-17T08:02:59.290Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-17T08:25:22.370Z",
//                     "activatedAt": "2026-01-17T08:21:32.468Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "P3TXURGA",
//                     "tempSessionId": "p3txurga1768638092468-1768638092468",
//                     "profile": {
//                         "name": "Shivam Maurya",
//                         "phone": "06394993317",
//                         "email": "shivam@gmail.com",
//                         "bio": "",
//                         "about": "",
//                         "city": "Noida",
//                         "twitter": "",
//                         "instagram": "",
//                         "linkedin": "",
//                         "website": ""
//                     }
//                 },
//                 {
//                     "_id": "696b5978d93e217f1846b540",
//                     "activationCode": "XT24PY71",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/XT24PY71",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-17T09:42:16.740Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-19T16:15:47.553Z",
//                     "activatedAt": "2026-01-19T16:15:47.552Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "XT24PY71",
//                     "tempSessionId": "xt24py711768839347552-1768839347552"
//                 },
//                 {
//                     "_id": "696b59807a18c38640a1391f",
//                     "activationCode": "Q8HP2V4Y",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/Q8HP2V4Y",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-17T09:42:24.955Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-19T16:15:01.162Z",
//                     "activatedAt": "2026-01-19T16:14:33.632Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "Q8HP2V4Y",
//                     "tempSessionId": "q8hp2v4y1768839273632-1768839273632",
//                     "profile": {
//                         "name": "Rahul",
//                         "phone": "9792721939",
//                         "email": "Rahul@gmail.com",
//                         "bio": "",
//                         "about": "",
//                         "city": "",
//                         "twitter": "",
//                         "instagram": "",
//                         "linkedin": "",
//                         "website": ""
//                     }
//                 },
//                 {
//                     "_id": "696b5f76d93e217f1846b54e",
//                     "activationCode": "NW6L9WRV",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/NW6L9WRV",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-17T10:07:50.943Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-18T13:36:10.580Z",
//                     "activatedAt": "2026-01-18T13:36:10.579Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "NW6L9WRV",
//                     "tempSessionId": "nw6l9wrv1768743370579-1768743370579"
//                 },
//                 {
//                     "_id": "696b6130be614db70ab3972b",
//                     "activationCode": "KHCAZ0CR",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/KHCAZ0CR",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-17T10:15:12.767Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-18T13:34:09.821Z",
//                     "activatedAt": "2026-01-18T13:34:09.812Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "KHCAZ0CR",
//                     "tempSessionId": "khcaz0cr1768743249813-1768743249813"
//                 },
//                 {
//                     "_id": "696b61c64fb7cd6c81e10cac",
//                     "activationCode": "T01EYXUC",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/T01EYXUC",
//                     "isDownloaded": true,
//                     "createdAt": "2026-01-17T10:17:42.495Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-18T14:40:59.414Z",
//                     "activatedAt": "2026-01-18T13:22:08.859Z",
//                     "owner": "696a249bf01577c4b7f306fa",
//                     "slug": "T01EYXUC",
//                     "tempSessionId": "t01eyxuc1768742528859-1768742528859"
//                 }
//             ],
//             "userId": "696a249bf01577c4b7f306fa",
//             "profile": {
//                 "name": "Shivam Maurya",
//                 "phone": "6394993317"
//             }
//         },
//         {
//             "cards": [
//                 {
//                     "_id": "696b63868c69164435f26a32",
//                     "activationCode": "HFZ6XGTO",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/HFZ6XGTO",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-17T10:25:10.065Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-18T05:16:40.838Z",
//                     "activatedAt": "2026-01-18T05:16:40.828Z",
//                     "owner": "696bd6153ee6ef4c9bf603a4",
//                     "slug": "HFZ6XGTO",
//                     "tempSessionId": "hfz6xgto1768713400828-1768713400828"
//                 },
//                 {
//                     "_id": "696e5e8991040638fc1f5518",
//                     "activationCode": "2QTD3MQG",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/2QTD3MQG",
//                     "isDownloaded": true,
//                     "createdAt": "2026-01-19T16:40:41.369Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-22T05:51:34.295Z",
//                     "activatedAt": "2026-01-22T05:42:52.262Z",
//                     "owner": "696bd6153ee6ef4c9bf603a4",
//                     "slug": "2QTD3MQG",
//                     "tempSessionId": "2qtd3mqg1769060572262-1769060572262"
//                 }
//             ],
//             "userId": "696bd6153ee6ef4c9bf603a4",
//             "profile": {
//                 "name": "Ankush Mehrohtra",
//                 "phone": "9792721939"
//             }
//         },
//         {
//             "cards": [
//                 {
//                     "_id": "696e5e8991040638fc1f5511",
//                     "activationCode": "1F0NLED2",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/1F0NLED2",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-19T16:40:41.369Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-19T16:40:56.117Z",
//                     "activatedAt": "2026-01-19T16:40:56.116Z",
//                     "owner": "696e5e3091040638fc1f54e9",
//                     "slug": "1F0NLED2",
//                     "tempSessionId": "1f0nled21768840856116-1768840856116"
//                 },
//                 {
//                     "_id": "696e5e8991040638fc1f5519",
//                     "activationCode": "MY6R2NZ0",
//                     "isActivated": true,
//                     "qrUrl": "https://brilson.in/c/card/MY6R2NZ0",
//                     "isDownloaded": false,
//                     "createdAt": "2026-01-19T16:40:41.369Z",
//                     "__v": 0,
//                     "updatedAt": "2026-01-19T16:44:13.646Z",
//                     "activatedAt": "2026-01-19T16:44:13.645Z",
//                     "owner": "696e5e3091040638fc1f54e9",
//                     "slug": "MY6R2NZ0",
//                     "tempSessionId": "my6r2nz01768841053645-1768841053645"
//                 }
//             ],
//             "userId": "696e5e3091040638fc1f54e9",
//             "profile": {
//                 "name": "Aeimesh Jainifer",
//                 "phone": "8696661919"
//             }
//         }
//     ]
// }