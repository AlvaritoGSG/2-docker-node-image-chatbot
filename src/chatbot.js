const { useMultiFileAuthState, default: makeWASocket, DisconnectReason } = require("baileys")

// Lógica para conectar con WhatsApp
const conectarConWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        // can provide additional config here
        auth: state,
        printQRInTerminal: true
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                conectarConWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async event => {
        for (const m of event.messages) {
            console.log(JSON.stringify(m, undefined, 2))

            // if (event.type === 'notify' && !m.key.fromMe && m.message) {
            //     console.log('message received', m);
            // }
            const id = m.key.remoteJid;
            if (event.type != 'notify' || m.key.fromMe || id.includes("@g.us") || id.includes("@broadcast")) {
                return;
            }

            console.log('replying to', m.key.remoteJid)
            await sock.sendMessage(m.key.remoteJid, { text: 'Hello WhatsApp' })
        }
    })

    // to storage creds (session info) when it updates
    sock.ev.on('creds.update', saveCreds)
}

// run in main file
conectarConWhatsApp();

// También se requiere la dependencia:
// npm install qrcode-terminal