import { prisma } from "../app.js";

export const createSell = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const sell = await prisma.sell.create({
      data: {
        quantity: Number(quantity),
        createdAt: new Date(),
        updatedAt: new Date(),
        unitPrice: product.price,
        totalPrice: product.price * Number(quantity),
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res.status(201).json({
      message: "Sell created successfully",
      sell,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

export const getSellById = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const sell = await prisma.sell.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!sell) {
      return res.status(404).json({
        message: "Sell not found",
      });
    }
    return res.status(200).json({
      sell,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

export const getSells = async (req, res) => {
  const { userId } = req;

  try {
    const sells = await prisma.sell.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true,
      },
    });

    console.log(sells);

    return res.status(200).json({
      sells,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const updateSell = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const sell = await prisma.sell.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!sell) {
      return res.status(404).json({
        message: "Sell not found",
      });
    }
    const product = await prisma.product.findUnique({
      where: {
        id: sell.productId,
      },
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    await prisma.sell.update({
      where: {
        id: id,
      },
      data: {
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      },
    });
    return res.status(200).json({
      message: "Sell updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

export const deleteSell = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const sell = await prisma.sell.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!sell) {
      return res.status(404).json({
        message: "Sell not found",
      });
    }
    await prisma.sell.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      message: "Sell deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

/* In Progress */

export const getSellsByDate = async (req, res) => {
  const { userId } = req;
  const { date } = req.params;
  try {
    const sells = await prisma.sell.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(date),
        },
      },
      include: {
        product: true,
      },
    });
    return res.status(200).json({
      sells,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};
