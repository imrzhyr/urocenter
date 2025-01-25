import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface PatientInfoCardProps {
  complaint: string;
  reportsCount: number;
  age: string;
  gender: string;
  patientId: string;
  isResolved: boolean;
  phone: string;
  onClose: () => void;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  complaint,
  reportsCount,
  age,
  gender,
  patientId,
  isResolved,
  phone,
  onClose
}) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t('basic_info')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('age')}</p>
                <p className="font-medium">{age || t('not_specified')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('gender')}</p>
                <p className="font-medium">{gender || t('not_specified')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('phone')}</p>
                <p className="font-medium">{phone || t('no_phone')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('status')}</p>
                <p className={cn(
                  "font-medium",
                  isResolved ? "text-green-500" : "text-yellow-500"
                )}>
                  {isResolved ? t('resolved') : t('active')}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          {complaint && (
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('medical_info')}</h3>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('complaint')}</p>
                <p className="font-medium whitespace-pre-wrap">{complaint}</p>
              </div>
            </div>
          )}

          {/* Reports */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t('medical_reports')}</h3>
            <p className="text-sm">
              {reportsCount > 0 
                ? `${reportsCount} ${t('reports')}`
                : t('no_reports')}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 