"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const supabaseClient_1 = __importDefault(require("./database/supabaseClient"));
app_1.default.listen(3001, (err) => {
    console.log(`App listening on port ${3001}`);
});
async function createBucket() {
    const { data, error } = await supabaseClient_1.default.storage.createBucket("merchant-media", {
        public: true,
    });
}
createBucket();
