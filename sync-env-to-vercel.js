const fs = require("fs");
const { execSync } = require("child_process");

const envFile = ".env.local"; // Ganti sesuai kebutuhan
const envVars = fs.readFileSync(envFile, "utf-8")
  .split("\n")
  .filter(line => line && !line.startsWith("#"));

envVars.forEach(line => {
  const [key, value] = line.split("=");

  try {
    console.log(`🧹 Menghapus var lama: ${key}`);
    execSync(`vercel env rm ${key} production -y`, { stdio: "ignore" });
  } catch {}

  try {
    console.log(`🔄 Menambahkan ${key}=${value}`);
    const proc = execSync(`echo "${value}" | vercel env add ${key} production`, {
      stdio: "pipe"
    });

    console.log(proc.toString());
  } catch (e) {
    console.error(`❌ Gagal menyinkronkan ${key}: ${e.message}`);
  }
});
   