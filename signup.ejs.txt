<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniNews — Create Access Profile</title>
    <style>
        :root {
            --bg-deep: #0a0b10;
            --card-glass: rgba(20, 22, 33, 0.65);
            --border-glass: rgba(255, 255, 255, 0.08);
            --accent-gold: #d4af37;
            --text-primary: #f0f2f5;
            --text-muted: #8a8f98;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--bg-deep);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
        }

        /* Ambient background glow */
        body::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
            top: 10%;
            left: 10%;
            z-index: 0;
        }

        .auth-container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 420px;
            background: var(--card-glass);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--border-glass);
            border-radius: 16px;
            padding: 40px 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .brand-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .brand-logo {
            font-size: 1.6rem;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--text-primary);
            border-bottom: 2px solid var(--accent-gold);
            display: inline-block;
            padding-bottom: 4px;
            margin-bottom: 12px;
        }

        .brand-tagline {
            font-size: 0.85rem;
            color: var(--text-muted);
            letter-spacing: 1px;
        }

        .form-group {
            margin-bottom: 20px;
            position: relative;
        }

        .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            margin-bottom: 8px;
        }

        .form-group input {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-glass);
            border-radius: 8px;
            padding: 12px 16px;
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--accent-gold);
            background: rgba(255, 255, 255, 0.06);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
        }

        .submit-btn {
            width: 100%;
            background: var(--accent-gold);
            color: #000;
            border: none;
            border-radius: 8px;
            padding: 14px;
            font-size: 0.95rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: transform 0.2s ease, opacity 0.2s ease;
            margin-top: 10px;
        }

        .submit-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        .submit-btn:active {
            transform: translateY(1px);
        }

        .auth-footer {
            text-align: center;
            margin-top: 24px;
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        .auth-footer a {
            color: var(--accent-gold);
            text-decoration: none;
            font-weight: 600;
            margin