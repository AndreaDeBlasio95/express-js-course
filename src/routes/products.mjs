import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  res.send([{ id: 1, productName: "berry", price: 2.99 }]);
});

export default router;
