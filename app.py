from flask import Flask, request, jsonify
import yt_dlp

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def get_video():
    # استقبال رابط الفيديو من تطبيق Sketchware عبر الرابط
    video_url = request.args.get('url')
    
    if not video_url:
        return jsonify({"error": "Missing URL"}), 400

    # إعدادات جلب الروابط المباشرة (أفضل جودة مدمجة صوت وفيديو)
    ydl_opts = {'format': 'best'}
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            return jsonify({
                "status": "success",
                "title": info.get('title'),
                "download_url": info.get('url'),
                "thumbnail": info.get('thumbnail')
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
