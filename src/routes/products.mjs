import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  //console.log(req.headers.cookie); // this will return a string with the cookies, i.e. "hello=world; name=world"
  //console.log(req.cookies); // this will return an object with the cookies
  console.log(req.signedCookies.hello);
  if (req.signedCookies.hello && req.signedCookies.hello === "world")
    return res.send([{ id: 1, productName: "berry", price: 2.99 }]);

  return res.status(403).send({ msg: "Sorry, you need the right cookie" });
});

export default router;
