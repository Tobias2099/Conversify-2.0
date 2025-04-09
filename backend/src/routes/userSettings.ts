import express, {Request, Response} from "express";
import UserSettings from "../models/UserSettings";

const router = express.Router();

router.post("/", async (req: Request, res: Response) : Promise<any> => {
  const { language, proficiency, conversationSetting } = req.body;

  if (!language || !proficiency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let settings = await UserSettings.findOne();

    if (settings) {
      settings.language = language;
      settings.proficiency = proficiency;
      settings.conversationSetting = conversationSetting;
      await settings.save();
    } else {
      settings = await UserSettings.create({
        language,
        proficiency,
        conversationSetting
      });
    }

    res.status(200).json(settings);
  } catch (err) {
    console.error("Error saving settings:", err);
    res.status(500).json({ error: "Internal Server Error"});
  }
});

router.get("/", async (req: Request, res: Response) : Promise<any> => {
  try {
    const settings = await UserSettings.findOne();
    if (!settings) return res.status(404).json({ error: "No settings found" });

    res.json(settings);
  } catch (err) {
    console.error("Error retrieving settings: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;