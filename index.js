const { Client } = require('discord.js-selfbot-v13');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');

const client = new Client({ checkUpdate: false });
const TOKEN = process.env.DISCORD_TOKEN;
// الآي دي بتاع الروم الصوتي اللي هتشغل فيه البث
const VOICE_CHANNEL_ID = "1525638600891306064"; 

client.on('ready', async () => {
    console.log(`[+] متصل: ${client.user.tag}`);
    try {
        const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
        if (!channel) return console.log('[!] روم غلط أو الايدي مش صح.');

        const connection = await client.voice.joinChannel(channel, {
            selfMute: true, selfDeaf: true, selfVideo: true
        });

        connection.on('ready', () => {
            const ffmpegProcess = spawn(ffmpegPath, [
                '-re', '-f', 'lavfi', '-i', 'testsrc=size=640x480:rate=1',
                '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
                '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
                '-c:a', 'aac', '-f', 'matroska', 'pipe:1'
            ]);
            connection.playStream(ffmpegProcess.stdout, { type: 'video' });
            console.log(`[+] البث شغال..`);
        });

        setTimeout(() => { process.exit(0); }, 5.5 * 60 * 60 * 1000); 
    } catch (e) { console.log(`[!] خطأ: ${e.message}`); }
});
client.login(TOKEN);
