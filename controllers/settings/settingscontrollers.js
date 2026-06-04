

const Setting = require("../../models/Settingmodel")
const imagekit = require("../../utilits/imagekit");



const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const createSettings = async (req, res) => {
  try {

    const exists = await Setting.findOne();

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Settings already exist",
      });
    }

    let herosection = "";
   let resultBg = [];


    if (req.files?.herosection?.[0]) {

      const file = req.files.herosection[0];

      const upload = await imagekit.upload({
        file: file.buffer,
        fileName: Date.now() + "-" + file.originalname,
        folder: "/settings",
      });

      herosection = upload.url;
    }

if (req.files?.resultBg?.length) {

  for (const file of req.files.resultBg) {

    const upload = await imagekit.upload({
      file: file.buffer,
      fileName: Date.now() + "-" + file.originalname,
      folder: "/settings",
    });

    resultBg.push(upload.url);
  }
}

    const settings = await Setting.create({

      hook: {

        text1: {
          ar: req.body.text1_ar,
          en: req.body.text1_en,
        },

        text2: {
          ar: req.body.text2_ar,
          en: req.body.text2_en,
        },

        highlight1: {
          ar: req.body.highlight1_ar,
          en: req.body.highlight1_en,
        },

        highlight2: {
          ar: req.body.highlight2_ar,
          en: req.body.highlight2_en,
        },

      },

      buttonText: {
        ar: req.body.buttonText_ar,
        en: req.body.buttonText_en,
      },

      colors: {
        backgroundColor: req.body.backgroundColor,
        buttonbackground: req.body.buttonbackground,
        buttontext: req.body.buttontext,
        textColor: req.body.textColor,
        highlightColor: req.body.highlightColor,
      },

      images: {
        herosection,
        resultBg,
      },
      Fontfamily: req.body.Fontfamily || "Cairo",
      Brand: req.body.Brand || "",
      shippingPrice: req.body.shippingPrice || 60,
    
       reviewheader: {
  text: {
    ar: req.body.textreview_ar,
    en: req.body.textreview_en,
  },
  paragraph: {
    ar: req.body.paragraphreview_ar,
    en: req.body.paragraphreview_en,
  },
      },
         shippingSignature: {
    ar: req.body.shippingSignature_ar,
    en: req.body.shippingSignature_en,
  },
     fansText: {
       ar: req.body.fansText_ar,
      en: req.body.fansText_en,
      },
     shippingSignature: {
  ar: req.body.shippingSignature_ar,
  en: req.body.shippingSignature_en,
      },
      floatingButton: {
        visible: req.body.floatingButton_visible !== undefined
          ? req.body.floatingButton_visible === "true"
          : true,
        text: {
          ar: req.body.floatingButton_text_ar || "اشتري الآن",
          en: req.body.floatingButton_text_en || "Buy Now",
        }
      }

    });

    res.status(201).json({
      success: true,
      settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateSettings = async (req, res) => {
  try {

    const settings = await Setting.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    const updateData = {};


    const hook = {};


    if (req.body.text1_ar || req.body.text1_en) {

      hook.text1 = {
        ...settings.hook?.text1,

        ...(req.body.text1_ar && {
          ar: req.body.text1_ar,
        }),

        ...(req.body.text1_en && {
          en: req.body.text1_en,
        }),
      };
    }

  
    if (req.body.text2_ar || req.body.text2_en) {

      hook.text2 = {
        ...settings.hook?.text2,

        ...(req.body.text2_ar && {
          ar: req.body.text2_ar,
        }),

        ...(req.body.text2_en && {
          en: req.body.text2_en,
        }),
      };
    }

  
    if (req.body.highlight1_ar || req.body.highlight1_en) {

      hook.highlight1 = {
        ...settings.hook?.highlight1,

        ...(req.body.highlight1_ar && {
          ar: req.body.highlight1_ar,
        }),

        ...(req.body.highlight1_en && {
          en: req.body.highlight1_en,
        }),
      };
    }

    // highlight2
    if (req.body.highlight2_ar || req.body.highlight2_en) {

      hook.highlight2 = {
        ...settings.hook?.highlight2,

        ...(req.body.highlight2_ar && {
          ar: req.body.highlight2_ar,
        }),

        ...(req.body.highlight2_en && {
          en: req.body.highlight2_en,
        }),
      };
    }

    if (Object.keys(hook).length > 0) {

      updateData.hook = {
        ...settings.hook,
        ...hook,
      };
    }
    // ================= REVIEW HEADER =================
    // ================= FLOATING BUTTON =================
if (req.body.floatingButton_visible !== undefined) {
  updateData["floatingButton.visible"] = req.body.floatingButton_visible === "true";
}
if (req.body.floatingButton_text_ar || req.body.floatingButton_text_en) {
  updateData["floatingButton.text"] = {
    ...settings.floatingButton?.text,
    ...(req.body.floatingButton_text_ar && { ar: req.body.floatingButton_text_ar }),
    ...(req.body.floatingButton_text_en && { en: req.body.floatingButton_text_en }),
  };
}

const reviewheader = {};

if (req.body.textreview_ar || req.body.textreview_en) {
  reviewheader.text = {
    ...settings.reviewheader?.text,

    ...(req.body.textreview_ar && {
      ar: req.body.textreview_ar,
    }),

    ...(req.body.textreview_en && {
      en: req.body.textreview_en,
    }),
  };
}

if (
  req.body.paragraphreview_ar ||
  req.body.paragraphreview_en
) {
  reviewheader.paragraph = {
    ...settings.reviewheader?.paragraph,

    ...(req.body.paragraphreview_ar && {
      ar: req.body.paragraphreview_ar,
    }),

    ...(req.body.paragraphreview_en && {
      en: req.body.paragraphreview_en,
    }),
  };
}

if (Object.keys(reviewheader).length > 0) {
  updateData.reviewheader = {
    ...settings.reviewheader,
    ...reviewheader,
  };
    }

if (req.body.shippingPrice !== undefined) {
  updateData.shippingPrice = Number(req.body.shippingPrice);
}
if (req.body.shippingSignature_ar || req.body.shippingSignature_en) {
  updateData.shippingSignature = {
    ar:
      req.body.shippingSignature_ar !== undefined
        ? req.body.shippingSignature_ar
        : settings.shippingSignature?.ar || "",

    en:
      req.body.shippingSignature_en !== undefined
        ? req.body.shippingSignature_en
        : settings.shippingSignature?.en || "",
  };
}


if (req.body.fansText_ar || req.body.fansText_en) {
  updateData.fansText = {
    ar:
      req.body.fansText_ar !== undefined
        ? req.body.fansText_ar
        : settings.fansText?.ar || "",

    en:
      req.body.fansText_en !== undefined
        ? req.body.fansText_en
        : settings.fansText?.en || "",
  };
}
    // ================= BUTTON =================
    if (
      req.body.buttonText_ar ||
      req.body.buttonText_en
    ) {

      updateData.buttonText = {
        ...settings.buttonText,

        ...(req.body.buttonText_ar && {
          ar: req.body.buttonText_ar,
        }),

        ...(req.body.buttonText_en && {
          en: req.body.buttonText_en,
        }),
      };
    }

    // ================= COLORS =================
    const colors = {};

    if (req.body.backgroundColor)
      colors.backgroundColor = req.body.backgroundColor;

    if (req.body.buttonbackground)
      colors.buttonbackground = req.body.buttonbackground;

    if (req.body.buttontext)
      colors.buttontext= req.body.buttontext;

    if (req.body.textColor)
      colors.textColor = req.body.textColor;

    if (req.body.highlightColor)
      colors.highlightColor = req.body.highlightColor;

    if (Object.keys(colors).length > 0) {

      updateData.colors = {
        ...settings.colors,
        ...colors,
      };
    }

    // ================= IMAGES =================
    const images = {};

    // hero image
    if (req.files?.herosection?.[0]) {

      const file = req.files.herosection[0];

      const upload = await imagekit.upload({
        file: file.buffer,
        fileName: Date.now() + "-" + file.originalname,
        folder: "/settings",
      });

      images.herosection = upload.url;
    }

    // result image
if (req.files?.resultBg?.length || req.body.existingResultBg) {
  

  let existingUrls = [];
  if (req.body.existingResultBg) {
    try {
      existingUrls = JSON.parse(req.body.existingResultBg);
    } catch (_) {
      existingUrls = [];
    }
  }


  const uploadedUrls = [];
  if (req.files?.resultBg?.length) {
    for (const file of req.files.resultBg) {
      const upload = await imagekit.upload({
        file: file.buffer,
        fileName: Date.now() + "-" + file.originalname,
        folder: "/settings",
      });
      uploadedUrls.push(upload.url);
    }
  }

  // ادمج القديم + الجديد
  images.resultBg = [...existingUrls, ...uploadedUrls];
}

    if (Object.keys(images).length > 0) {

      updateData.images = {
        ...settings.images,
        ...images,
      };
    }
// ================= FONT =================
if (req.body.Fontfamily) {
  updateData.Fontfamily = req.body.Fontfamily;
    }
    if (req.body.Brand) {
  updateData.Brand = req.body.Brand;
}
    // ================= UPDATE =================
    const updated = await Setting.findByIdAndUpdate(
      settings._id,
      updateData,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      settings: updated,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
    getSettings,
    createSettings,
    updateSettings
    
}