
const SectionOrder = require("../../models/SectionOrdermodel");

const getSectionOrder = async (req, res) => {
  try {
    let doc = await SectionOrder.findOne();
    if (!doc) doc = await SectionOrder.create({});

    res.json({
      success: true,
      order: {
        Heroheader: doc.Heroheader,
        Hero:       doc.Hero,
        product:    doc.product,
        after:      doc.after,
        review:     doc.review,
        CTA:        doc.CTA,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateSectionOrder = async (req, res) => {
  try {
    const { Heroheader, Hero, product, after, review, CTA } = req.body;

    const values = [Heroheader, Hero, product, after, review, CTA];
    const isValid =
      values.every((v) => [1, 2, 3, 4, 5, 6].includes(Number(v))) &&
      new Set(values).size === 6;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "القيم لازم تكون 1 لـ 6 من غير تكرار",
      });
    }

    let doc = await SectionOrder.findOne();

    if (!doc) {
      doc = await SectionOrder.create({ Heroheader, Hero, product, after, review, CTA });
    } else {
      doc.Heroheader = Heroheader;
      doc.Hero       = Hero;
      doc.product    = product;
      doc.after      = after;
      doc.review     = review;
      doc.CTA        = CTA;
      await doc.save();
    }

    res.json({
      success: true,
      order: {
        Heroheader: doc.Heroheader,
        Hero:       doc.Hero,
        product:    doc.product,
        after:      doc.after,
        review:     doc.review,
        CTA:        doc.CTA,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSectionOrder, updateSectionOrder };