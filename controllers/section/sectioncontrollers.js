// controllers/sectionOrder.controller.js
const SectionOrder =require( "../../models/SectionOrdermodel");

// ── GET ───────────────────────────────────────────────────────────────────
 const getSectionOrder = async (req, res) => {
  try {
    let doc = await SectionOrder.findOne();

    if (!doc) {
      doc = await SectionOrder.create({});  // هياخد الـ defaults تلقائي
    }

    res.json({
      success: true,
      order: {
        product: doc.product,
        after:   doc.after,
        review:  doc.review,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateSectionOrder = async (req, res) => {
  try {
    const { product, after, review } = req.body;


    const values = [product, after, review];
    const isValid =
      values.every((v) => [1, 2, 3].includes(v)) &&
      new Set(values).size === 3; 

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "لازم القيم تكون 1 و2 و3 من غير تكرار",
      });
    }

    let doc = await SectionOrder.findOne();

    if (!doc) {
      doc = await SectionOrder.create({ product, after, review });
    } else {
      doc.product = product;
      doc.after   = after;
      doc.review  = review;
      await doc.save();
    }

    res.json({
      success: true,
      order: {
        product: doc.product,
        after:   doc.after,
        review:  doc.review,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  getSectionOrder,
  updateSectionOrder
}