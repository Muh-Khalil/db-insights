'use client';

import { DatabaseConfig, DatabaseType } from '@/types';
import { useState } from 'react';
import { Database, Server, Lock, Eye, EyeOff, TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface DbConnectProps {
    onConnect: (config: DatabaseConfig, schema: unknown) => void;
    onDemoMode: () => void;
}

const DB_DEFAULTS: Record<DatabaseType, Partial<DatabaseConfig>> = {
    mysql: { host: 'localhost', port: 3306 },
    postgresql: { host: 'localhost', port: 5432 },
    sqlite: {},
};

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export function DbConnect({ onConnect, onDemoMode }: DbConnectProps) {
    const [dbType, setDbType] = useState<DatabaseType>('mysql');
    const [config, setConfig] = useState<DatabaseConfig>({ type: 'mysql', host: 'localhost', port: 3306 });
    const [showPwd, setShowPwd] = useState(false);
    const [testStatus, setTestStatus] = useState<TestStatus>('idle');
    const [testMessage, setTestMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const updateConfig = (updates: Partial<DatabaseConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
        setTestStatus('idle');
    };

    const handleTypeChange = (type: DatabaseType) => {
        setDbType(type);
        setConfig({ type, ...DB_DEFAULTS[type] });
        setTestStatus('idle');
    };

    const testConnection = async () => {
        setTestStatus('testing');
        setTestMessage('Connecting...');

        try {
            const res = await fetch('/api/schema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            const data = await res.json();

            if (data.success) {
                setTestStatus('success');
                setTestMessage(`Connected! Found ${data.schema.tables.length} tables.`);
            } else {
                setTestStatus('error');
                setTestMessage(data.error || 'Connection failed');
            }
        } catch (err) {
            setTestStatus('error');
            setTestMessage('Network error — check your connection');
        }
    };

    const connect = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/schema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            const data = await res.json();

            if (data.success) {
                onConnect(config, data.schema);
            } else {
                setTestStatus('error');
                setTestMessage(data.error || 'Connection failed');
            }
        } catch {
            setTestStatus('error');
            setTestMessage('Failed to connect to database');
        } finally {
            setLoading(false);
        }
    };

    const dbTypes: Array<{ value: DatabaseType; label: string; color: string; logo: string }> = [
        { value: 'mysql', label: 'MySQL', color: '#e38c57', logo: '🐬' },
        { value: 'postgresql', label: 'PostgreSQL', color: '#336791', logo: '🐘' },
        { value: 'sqlite', label: 'SQLite', color: '#003b57', logo: '🗃️' },
    ];

    return (
        <div className="max-w-[560px] mx-auto">
            {/* DB Type Selector */}
            <div className="flex gap-2.5 mb-6">
                {dbTypes.map(db => (
                    <button
                        key={db.value}
                        onClick={() => handleTypeChange(db.value)}
                        className={`flex-1 p-3 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 ${dbType === db.value
                            ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className="text-2xl mb-1.5 grayscale-0 group-hover:scale-110 transition-transform">{db.logo}</div>
                        <div className={`text-[11px] font-bold uppercase tracking-wider ${dbType === db.value ? 'text-blue-400' : 'text-slate-500'
                            }`}>
                            {db.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Connection Form */}
            <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-6">
                    <Server size={16} className="text-blue-500" />
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                        {dbType === 'sqlite' ? 'File Path' : 'Connection Details'}
                    </span>
                </div>

                {dbType === 'sqlite' ? (
                    <div className="mb-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                            Database File Path
                        </label>
                        <input
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="C:\path\to\database.db or /path/to/database.db"
                            value={config.filename || ''}
                            onChange={e => updateConfig({ filename: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                                    Host
                                </label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="localhost"
                                    value={config.host || ''}
                                    onChange={e => updateConfig({ host: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                                    Port
                                </label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
                                    type="number"
                                    value={config.port || ''}
                                    onChange={e => updateConfig({ port: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                                Database Name
                            </label>
                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="my_database"
                                value={config.database || ''}
                                onChange={e => updateConfig({ database: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                                    Username
                                </label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="root"
                                    value={config.username || ''}
                                    onChange={e => updateConfig({ username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
                                        type={showPwd ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={config.password || ''}
                                        onChange={e => updateConfig({ password: e.target.value })}
                                    />
                                    <button
                                        onClick={() => setShowPwd(!showPwd)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security note */}
                <div className="flex items-start gap-2.5 mt-6 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 transition-colors hover:bg-blue-500/10">
                    <Lock size={12} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                        Credentials stay local — only <span className="text-blue-400 font-bold">SELECT</span> queries are executed. No data is sent externally.
                    </p>
                </div>

                {/* Test status */}
                {testStatus !== 'idle' && (
                    <div className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 text-sm font-medium transition-all animate-slide-up ${testStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        testStatus === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                        {testStatus === 'testing' && <Loader2 size={16} className="animate-spin" />}
                        {testStatus === 'success' && <CheckCircle size={16} />}
                        {testStatus === 'error' && <XCircle size={16} />}
                        {testMessage}
                    </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                    <button
                        onClick={testConnection}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={testStatus === 'testing'}
                    >
                        <TestTube size={15} />
                        Test Connection
                    </button>
                    <button
                        onClick={connect}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Database size={15} />}
                        Connect & Explore
                    </button>
                </div>
            </div>
        </div>
    );
}
