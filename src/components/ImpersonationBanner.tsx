
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TranslatedText } from '@/components/TranslatedText';
import { UserCheck, X, Crown } from 'lucide-react';
import { useImpersonation } from '@/hooks/useImpersonation';

export const ImpersonationBanner = () => {
  const { impersonationContext, endImpersonation, loading } = useImpersonation();

  if (!impersonationContext) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'educator':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/10 mb-4">
      <Crown className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="h-4 w-4 text-orange-600" />
          <span className="font-medium text-orange-800 dark:text-orange-200">
            <TranslatedText text="Admin Impersonation Active" />
          </span>
          <span className="text-orange-700 dark:text-orange-300">
            <TranslatedText text="You are viewing as" />: {impersonationContext.target_first_name} {impersonationContext.target_last_name}
          </span>
          <Badge className={getRoleBadgeColor(impersonationContext.target_role)}>
            <TranslatedText text={impersonationContext.target_role} />
          </Badge>
          <span className="text-sm text-orange-600 dark:text-orange-400">
            ({impersonationContext.target_email})
          </span>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={endImpersonation}
          disabled={loading}
          className="text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-200 dark:border-orange-700 dark:hover:bg-orange-900/20"
        >
          <X className="h-4 w-4 mr-1" />
          <TranslatedText text="End Impersonation" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
