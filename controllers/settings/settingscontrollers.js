

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



    if (req.files?.herosection?.[0]) {

      const file = req.files.herosection[0];

      const upload = await imagekit.upload({
        file: file.buffer,
        fileName: Date.now() + "-" + file.originalname,
        folder: "/settings",
      });

      herosection = upload.url;
    }


    const resultPages = [];
    const pagesMeta = req.body.resultPages ? JSON.parse(req.body.resultPages) : [];
      for (const page of pagesMeta) {
      const slides = [];
      const filesKey = `resultPage_${page.index}_slides`;

      if (req.files?.[filesKey]) {
        for (const file of req.files[filesKey]) {
          const upload = await imagekit.upload({
            file: file.buffer,
            fileName: Date.now() + "-" + file.originalname,
            folder: `/settings/resultPages/${page.index}`,
          });
          slides.push(upload.url);
        }
      }

      resultPages.push({ index: page.index, slides });
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
        primaryDark: req.body.primaryDark,
        secondaryDark: req.body.secondaryDark,
        primary: req.body.primary,
        gold: req.body.gold,
        goldLight: req.body.goldLight,
      },

      images: {
        herosection
      },
         resultPages,
      Fontfamily: req.body.Fontfamily || "Cairo",

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

    if (req.body.primaryDark)
      colors.primaryDark = req.body.primaryDark;

    if (req.body.secondaryDark)
      colors.secondaryDark = req.body.secondaryDark;

    if (req.body.primary)
      colors.primary = req.body.primary;

    if (req.body.gold)
      colors.gold = req.body.gold;

    if (req.body.goldLight)
      colors.goldLight = req.body.goldLight;

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

    if (req.body.updateResultPages) {
  const pagesMeta = JSON.parse(req.body.updateResultPages);

  // ابدأ بنسخة من الموجود
  const existingPages = settings.resultPages
    ? settings.resultPages.map((p) => ({ index: p.index, slides: [...p.slides] }))
    : [];

  for (const page of pagesMeta) {
    const filesKey = `resultPage_${page.index}_slides`;
    const newSlides = [];

    if (req.files?.[filesKey]) {
      for (const file of req.files[filesKey]) {
        const upload = await imagekit.upload({
          file: file.buffer,
          fileName: Date.now() + "-" + file.originalname,
          folder: `/settings/resultPages/${page.index}`,
        });
        newSlides.push(upload.url);
      }
    }


    const existingIndex = existingPages.findIndex((p) => p.index === page.index);

    if (existingIndex !== -1) {
       if (newSlides.length > 0) {
    existingPages[existingIndex].slides = newSlides;
  }
    } else {
      existingPages.push({ index: page.index, slides: newSlides });
    }
  }


  updateData.resultPages = existingPages.sort((a, b) => a.index - b.index);
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